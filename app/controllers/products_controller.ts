import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import CategoryDto from '#dtos/category'
import { ProductService } from '#services/product_service'
import ProductDto from '#dtos/product'
import MetaDto from '#dtos/meta'
import { CategoryService } from '#services/category_service'
import { SpecService } from '#services/spec_service'
import SpecDto from '#dtos/spec'
@inject()
export default class ProductsController {
  constructor(
    private productService: ProductService, 
    private categoryService: CategoryService,
    private specService: SpecService
  ) {}

  async plp({ inertia, request, params, response }: HttpContext) {
    const categories = await this.categoryService.all()
    const category = await this.categoryService.getByName(params.category.toUpperCase())
    const queryString = request.qs()
    const specs = queryString.specs?.split(',') || []
    const page = queryString.page || 1
    const specsIds = Array.isArray(specs) ? specs.map(Number) : [Number(specs)]
    if (!category) {
      return response.redirect().back()
    }
    const specsData = await this.specService.byTypes(category.specsTypes as any)
    const products = await this.productService.byCategory({ category: category.id, specs: specsIds, page })

    return inertia.render('plp/index', {
      categories: categories.map((category: any) => new CategoryDto(category)),
      products: ProductDto.fromArray(Array.from(products)),
      meta: new MetaDto(products.getMeta()),
      specs: specsData.map((spec: any) => new SpecDto(spec))
    })
  }

  async search({ request, params, inertia }: HttpContext) {
    // get name from query string
    const queryName = params.name

    // get page from query string
    const queryPage = request.qs().page || 1
    const page = queryPage ? Number(queryPage) : queryPage

    const products = await this.productService.search({ name: queryName, page })
    const categories = await this.categoryService.all()

    return inertia.render('search/index', {
      products: ProductDto.fromArray(Array.from(products)),
      categories: categories.map((category: any) => new CategoryDto(category)),
      meta: new MetaDto(products.getMeta()),
      name: queryName
    })
  }

  async pdp({ params, inertia }: HttpContext) {
    const id = params.id
    const product = await this.productService.one(id)
    const categories = await this.categoryService.all()
    return inertia.render('pdp/index', {
      product: new ProductDto(product),
      categories: categories.map((category: any) => new CategoryDto(category)),
    })
  }
}
