import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { CategoryService } from '#services/category_service'
import CategoryDto from '#dtos/category'

@inject()
export default class HomeController {
    constructor(
        private categoryService: CategoryService
    ) {}
    async home({ inertia }: HttpContext) {
            const categories = await this.categoryService.all()
        return inertia.render('landing', {
            categories: categories.map((category: any) => new CategoryDto(category)),
        })          
    }
   
  }