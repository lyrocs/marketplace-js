import Deal from '#models/deal'
import Product from '#models/product'
import DealProduct from '#models/deal_product'
import DealStatus from '#enums/deal_status'

export class DealService {
  async all() {
    const deals = await Deal.query().preload('products')
    return deals
  }

  async one(id: number) {
    const singleDeal = await Deal.query()
      .preload('products')
      .where('id', id)
      .firstOrFail()
    return singleDeal
  }

  async byUser(userId: string) {
    const deals = await Deal.query()
      .where('user_id', userId)
      .preload('products')
    return deals
  }

  async search({
    specs = [],
    category = undefined,
    page = 1,
  }: { specs?: number[]; category?: number; page?: number } = {}) {
    const products = Deal.query().preload('products', (productQuery) => {
      productQuery.preload('category').preload('specs')
    })

    products.whereHas('products', (productQuery) => {
      if (category) {
        productQuery.where('category_id', category)
      }

      if (specs && specs.length) {
        productQuery.whereHas('specs', (specQuery) => {
          specQuery.whereIn('id', specs)
        })
      }
    })
    return products.paginate(page)
  }

  async create(data: { user_id: string }) {
    // find if empty deal exists for the user, wihtout products linked
    const existingDeal = await Deal.query()
      .where('user_id', data.user_id)
      .where('status', DealStatus.DRAFT)
      .whereNotExists((query) => {
        query.from('deal_products').whereRaw('deal_products.deal_id = deals.id')
      })
      .preload('products')
      .first()
    if (existingDeal) {
      return existingDeal
    }
    // if no empty deal exists, create a new on
    const newDeal = await Deal.create({ user_id: data.user_id, status: DealStatus.DRAFT })
    return newDeal
  }

  async addProduct(data: { product_id: number; deal_id: number }) {
    await DealProduct.create(data)
  }

  async update(
    id: number,
    data: {
      title: string
      description: string
      location: string
      currency: string
      price: number
      invoiceAvailable?: boolean
      sellingReason?: string
      canBeDelivered?: boolean
      features?: { label: string; value: string }[]
      condition?: string
      products: { productId: number; quantity: number }[]
    }
  ) {
    const existingDeal = await Deal.findOrFail(id)
    existingDeal.merge({
      title: data.title,
      description: data.description,
      location: data.location,
      currency: data.currency,
      price: data.price,
      invoiceAvailable: data.invoiceAvailable,
      sellingReason: data.sellingReason,
      canBeDelivered: data.canBeDelivered,
      features: data.features || [],
      condition: data.condition,
    })
    await existingDeal.save()

    await DealProduct.query().where('deal_id', id).delete()

    for (const product of data.products) {
      await DealProduct.create({
        deal_id: id,
        product_id: product.productId,
        quantity: product.quantity,
      })
    }

    return existingDeal
  }

  async addImage(id: number, imageUrl: string) {
    const deal = await Deal.findOrFail(id)
    if (!deal.images) {
      deal.images = []
    }
    deal.images.push(imageUrl)
    await deal.save()
  }

  async deleteImage(id: number, url: string) {
    const deal = await Deal.findOrFail(id)
    deal.images = deal.images.filter((image) => image !== url)
    await deal.save()
  }

  async createProduct(data: {
    name: string
    categoryId: number
    brandId: number
    user_id: string
  }) {
    const productData = {
      name: data.name,
      category_id: data.categoryId,
      brand_id: data.brandId,
      images: JSON.parse('[]'),
      status: DealStatus.DRAFT,
    }
    let product = await Product.create(productData)
    product = await Product.findOrFail(product.id)

    const deal = await Deal.create({
      user_id: data.user_id,
      status: DealStatus.DRAFT,
    })

    await DealProduct.create({
      deal_id: deal.id,
      product_id: product.id,
      quantity: 1,
    })

    return Deal.findOrFail(deal.id)
  }
}
