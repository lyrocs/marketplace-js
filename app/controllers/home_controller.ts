import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { ProductService } from '#services/product_service'
import ProductDto from '#dtos/product'

@inject()
export default class HomeController {
  constructor(
    private productService: ProductService
) {}
  async home({ inertia }: HttpContext) {
    const products = await this.productService.recent()
    return inertia.render('landing', {      
      products: ProductDto.fromArray(Array.from(products)),
    })
  }
}
