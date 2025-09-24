import Product from '#models/product'
// import ProductTranslation from '#models/product_translation'
import Shop from '#models/shop'
import type Spec from '#models/spec'

export class ProductService {
  // add type to specs
  async byCategory({
    specs = [],
    category = undefined,
    status = undefined,
    page = 1,
  }: { specs?: number[]; category?: number; status?: string; page?: number } = {}) {
    const products = Product.query()

    if (category) {
      products.where('category_id', category)
    }

    if (specs && specs.length) {
      products.whereHas('specs', (specQuery) => {
        specQuery.whereIn('id', specs)
      })
    }
    if (status) {
      products.where('status', status)
    }
    return products.preload('category').preload('specs', (specQuery) => {
      specQuery.preload('type')
    }).preload('shops').preload('brand').paginate(page)
  }

  async search({
    name,
    category,
    specs = [],
    page = 1,
  }: { name?: string; category?: number; specs?: number[]; page?: number } = {}) {
    const products = Product.query()

    if (name) {
      products.where('name', 'ilike', `%${name}%`)
    }
    if (category) {
      products.where('category_id', category)
    }
    if (specs && specs.length) {
      products.whereHas('specs', (specQuery) => {
        specQuery.whereIn('id', specs)
      })
    }
    return products.preload('category').preload('specs').preload('shops').preload('brand').paginate(page)
  }

  async recent() {
    const products = Product.query()
    return products.preload('category').preload('specs').preload('shops').preload('brand').orderBy('created_at', 'desc').limit(10)
  } 

  async one(id: number) {
    const product = await Product.query()
      .preload('category')
      .preload('specs')
      .preload('shops')
      .preload('brand')
      .where('id', id)
      .firstOrFail()
    return product
  }

  async create(data: { name: string; images: string[]; status: string; category_id: number, description?: string, features?: { title: string; items: string[] }[], brand_id: number }) {
    const product = await Product.create(data)
    return Product.findOrFail(product.id)
  }

  // async createTranslation(data: {
  //   product_id: number
  //   language: string
  //   name: string
  //   description: string
  //   features: { title: string; items: string[] }[]
  // }) {
  //   const product = await Product.findOrFail(data.product_id)
  //   const 
  //   product.merge(data)
  //   return ProductTranslation.findOrFail(translation.id)
  // }

  // async updateTranslation(data: {
  //   id: number
  //   product_id: number
  //   language: string
  //   name: string
  //   description: string
  //   features: { title: string; items: string[] }[]
  // }) {
  //   const translation = await ProductTranslation.findOrFail(data.id)
  //   translation.merge(data)
  //   await translation.save()
  //   return translation
  // }

  // async deleteTranslation(id: number) {
  //   const translation = await ProductTranslation.findOrFail(id)
  //   await translation.delete()
  //   return translation
  // }

  async attachSpecs(product: Product, specs: Spec[]) {
    // specs Ids should not have duplicates
    const specsIds = [...new Set(specs.map((spec) => spec.id))]
    await product.related('specs').attach(specsIds)
  }

  async syncSpecs(product: Product, specs: number[]) {
    await product.related('specs').sync(specs)
  }

  async createShop(data: {
    product_id: number
    url: string
    name: string
    price: number
    currency: string
    available: boolean
  }) {
    const source = await Shop.create(data)
    return source
  }

  async getByShop(url: string) {
    const source = await Shop.query().where('url', url).first()
    if (!source) {
      return null
    }
    return Product.findOrFail(source.productId)
  }

  async update(id: number, data: { name: string; images: string[]; status: string }) {
    const product = await Product.findOrFail(id)
    product.merge(data)
    await product.save()
    return Product.findOrFail(id)
  }
}
