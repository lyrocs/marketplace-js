import Product from '#models/product'
import ProductTranslation from '#models/product_translation'
import Source from '#models/source'
import type Spec from '#models/spec'

export class ProductService {
  async all({ page = 1 }: { page?: number } = {}) {
    return Product.query()
      .preload('category')
      .preload('specs')
      .preload('translations')
      .preload('sources')
      .preload('brand')
      .paginate(page)
  }
  // add type to specs
  async byCategory({
    specs = [],
    category = undefined,
    page = 1,
  }: { specs?: number[]; category?: number; page?: number } = {}) {
    const products = Product.query()

    if (category) {
      products.where('category_id', category)
    }

    if (specs && specs.length) {
      products.whereHas('specs', (specQuery) => {
        specQuery.whereIn('id', specs)
      })
    }
    return products.preload('category').preload('specs').preload('sources').preload('brand').paginate(page)
  }

  async search({
    name,
    page = 1,
  }: { name?: string; page?: number } = {}) {
    const products = Product.query()

    if (name) {
      products.where('name', 'ilike', `%${name}%`)
    }

    return products.preload('category').preload('specs').preload('sources').preload('brand').paginate(page)
  }

  async one(id: number) {
    const product = await Product.query()
      .preload('category')
      .preload('specs')
      .preload('translations')
      .preload('sources')
      .preload('brand')
      .where('id', id)
      .firstOrFail()
    return product
  }

  async create(data: { name: string; images: JSON; status: string; category_id: number }) {
    const product = await Product.create(data)
    return Product.findOrFail(product.id)
  }

  async createTranslation(data: {
    product_id: number
    language: string
    name: string
    description: string
    features: object
  }) {
    const translation = await ProductTranslation.create(data)
    return ProductTranslation.findOrFail(translation.id)
  }

  async attachSpecs(product: Product, specs: Spec[]) {
    await product.related('specs').attach(specs.map((spec) => spec.id))
  }

  async createSource(data: {
    product_id: number
    url: string
    shop: string
    price: number
    currency: string
    available: boolean
  }) {
    const source = await Source.create(data)
    return source
  }

  async getBySource(url: string) {
    const source = await Source.query().where('url', url).first()
    if (!source) {
      return null
    }
    return Product.findOrFail(source.productId)
  }
}
