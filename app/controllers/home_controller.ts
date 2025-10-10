import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { ProductService } from '#services/product_service'
import ProductDto from '#dtos/product'
import { DealService } from '#services/deal_service'
import DealDto from '#dtos/deal'

@inject()
export default class HomeController {
  constructor(
    private productService: ProductService,
    private dealService: DealService
  ) {}

  // [GET] /
  async home({ inertia }: HttpContext) {
    const products = await this.productService.recent()
    const deals = await this.dealService.recent()
    return inertia.render('home', {
      products: ProductDto.fromArray(Array.from(products)),
      deals: DealDto.fromArray(Array.from(deals)),
    })
  }
}
