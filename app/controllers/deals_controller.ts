import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { CategoryService } from '#services/category_service'
import { SpecService } from '#services/spec_service'
import { ProductService } from '#services/product_service'
import CategoryDto from '#dtos/category'
import SpecDto from '#dtos/spec'
import ProductDto from '#dtos/product'
import MetaDto from '#dtos/meta'
import { DealService } from '#services/deal_service'
import DealDto from '#dtos/deal'
import { updateDealValidator } from '#validators/deal'
@inject()
export default class DealsController {
  constructor(
    private categoryService: CategoryService,
    private specService: SpecService,
    private productService: ProductService,
    private dealService: DealService,
  ) { }

  async view({ inertia, params }: HttpContext) {
    const deal = await this.dealService.one(Number(params.id))
    return inertia.render('deals/view', { deal: new DealDto(deal) })
  }

  async my({ inertia, auth }: HttpContext) {
    const user = auth.user
    const deals = await this.dealService.byUser(user?.id || '')
    return inertia.render('deals/my', { deals: DealDto.fromArray(deals) })
  }

  async create({ auth, response }: HttpContext) {
    const deal = await this.dealService.create({
      user_id: auth.user?.id || '',
    })
    return response.redirect().toRoute('deals.edit', { id: deal.id })
  }

  async edit({ inertia, params }: HttpContext) {
    const deal = await this.dealService.one(Number(params.id))
    return inertia.render('deals/edit', { deal: new DealDto(deal) })
  }

  async searchProduct({ inertia, request, params }: HttpContext) {
    const queryString = request.qs()
    const categories = await this.categoryService.all()
    let category
    let specsData
    if (queryString.category) {
     category = await this.categoryService.getById(Number(queryString.category))
     specsData = await this.specService.byTypes(category?.specTypes?.map((type: any) => type.key) as any)
    }

    const specs = queryString.specs?.split(',') || []
    const page = queryString.page || 1
    const specsIds = Array.isArray(specs) ? specs.map(Number) : [Number(specs)]

    const deal = await this.dealService.one(Number(params.id))
   
    const products = await this.productService.byCategory({ category: category?.id, specs: specsIds, page })
    return inertia.render('deals/searchProduct', {    
              categories: categories.map((category: any) => new CategoryDto(category)),
               specs: specsData?.map((spec: any) => new SpecDto(spec)),
               products: ProductDto.fromArray(Array.from(products)),
               meta: new MetaDto(products.getMeta()),
               deal: new DealDto(deal),
        })
  }

  async addProduct({ request, response, params }: HttpContext) {
    const data = request.only(['product_id'])
    const dealId = Number(params.id)
    await this.dealService.addProduct({
      product_id: Number(data.product_id),
      deal_id: dealId
    })
    return response.redirect().toRoute('deals.edit', { id: dealId })
  }

  async update({ request, params, response }: HttpContext) {
    const data = request.all()
    const id = params.id
    const payload = await updateDealValidator.validate(data)
    await this.dealService.update(id, {
      title: payload.title,
      description: payload.description || '',
      location: payload.location || '',
      currency: payload.currency || '',
      price: payload.price,
      products: payload.products || [],
    })
    response.redirect().back()
  }

    async plp({ inertia, request, params, response }: HttpContext) {
      const categories = await this.categoryService.all()
      const category = await this.categoryService.getByKey(params.category.toUpperCase())
      const queryString = request.qs()
      const specs = queryString.specs?.split(',') || []
      const page = queryString.page || 1
      const specsIds = Array.isArray(specs) ? specs.map(Number) : [Number(specs)]
      if (!category) {
        return response.redirect().back()
      }
      const specsData = await this.specService.byTypes(category.specTypes.map((specType: any) => specType.key) as any)
      const deals = await this.dealService.search({ category: category.id, specs: specsIds, page })
  
      return inertia.render('plp/index', {
        categories: categories.map((category: any) => new CategoryDto(category)),
        deals: DealDto.fromArray(Array.from(deals)),
        meta: new MetaDto(deals.getMeta()),
        specs: specsData.map((spec: any) => new SpecDto(spec)),
        category: params.category,
        isDeal: true
      })
    }
}
