import Product from '#models/product'
import ProductTranslation from '#models/product_translation'
import Source from '#models/source'
import type Spec from '#models/spec'

export class ProductService {
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
    return products.preload('category').preload('specs').preload('translations').preload('sources').preload('brand').paginate(page)
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

  async recent() {
    const products = Product.query()
    return products.preload('category').preload('specs').preload('sources').preload('brand').orderBy('created_at', 'desc').limit(10)
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

  async updateTranslation(data: {
    id: number
    product_id: number
    language: string
    name: string
    description: string
    features: object
  }) {
    const translation = await ProductTranslation.findOrFail(data.id)
    translation.merge(data)
    await translation.save()
    return translation
  }

  async deleteTranslation(id: number) {
    const translation = await ProductTranslation.findOrFail(id)
    await translation.delete()
    return translation
  }

  async attachSpecs(product: Product, specs: Spec[]) {
    await product.related('specs').attach(specs.map((spec) => spec.id))
  }

  async syncSpecs(product: Product, specs: number[]) {
    await product.related('specs').sync(specs)
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

  async update(id: number, data: { name: string; images: string[]; status: string }) {
    const product = await Product.findOrFail(id)
    product.merge(data)
    await product.save()
    return Product.findOrFail(id)
  }
}
