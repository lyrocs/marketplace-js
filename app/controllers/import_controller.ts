import { inject } from '@adonisjs/core'
import { SpecService } from '#services/spec_service'
import { ProductService } from '#services/product_service'
import { CategoryService } from '#services/category_service'
import { BrandService } from '#services/brand_service'
import { importValidator } from '#validators/import'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ImportController {
  constructor(
    private specService: SpecService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService
  ) {}

  async form({ inertia }: HttpContext) {
    return inertia.render('import/form')
  }

  async import({ request, inertia }: HttpContext) {
    const data = request.all()
    const requestData = await importValidator.validate(data)
    const products = requestData.products
    if (!products.length) {
      throw new Error('No products found')
    }
    let success = 0

    for (const payload of products) {
     
      const category = await this.categoryService.getByName(payload.category_name)
      if (!category?.id) {
        console.log('Category not found')
        continue
      }


      const existingProduct = await this.productService.getBySource(payload.url)
      if (existingProduct) {
        console.log('Product already exists')
        continue
      }

      const specs = await this.specService.createMany(payload.specs || [])

      const brandPayload = {
        name: payload.manufacturer_name,
      }
      const brand = await this.brandService.create(brandPayload)

      const productPayload = {
        name: payload.name,
        images: JSON.parse(JSON.stringify(payload.images)),
        status: 'PENDING',
        category_id: category?.id,
        brand_id: brand.id,
      }
      const product = await this.productService.create(productPayload)

      await this.productService.attachSpecs(product, specs)

      const translationPayload = {
        product_id: product.id,
        language: payload.language,
        name: payload.name,
        description: payload.description,
        features: payload.features || {},
      }

      const translation = await this.productService.createTranslation(translationPayload)

      const sourcePayload = {
        product_id: product.id,
        url: payload.url,
        shop: payload.shop,
        price: payload.price,
        currency: payload.currency,
        available: payload.available,
        language: payload.language,
      }

      const source = await this.productService.createSource(sourcePayload)

      success++

    }
    return inertia.render('import/form', {
      total: products.length,
      success,
    })
  }
}
