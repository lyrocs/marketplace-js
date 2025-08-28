import { inject } from '@adonisjs/core'
import { SpecService } from '#services/spec_service'
import { ProductService } from '#services/product_service'
import { CategoryService } from '#services/category_service'
import { BrandService } from '#services/brand_service'
import { importValidator } from '#validators/import'
import type { HttpContext } from '@adonisjs/core/http'
import CategoryDto from '#dtos/category'
@inject()
export default class ImportController {
  constructor(
    private specService: SpecService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService
  ) {}

  async home({ inertia }: HttpContext) {
    return inertia.render('admin/home')
  }

  async products({ inertia }: HttpContext) {
    return inertia.render('admin/products')
  }

  async categories({ inertia }: HttpContext) {
    const categories = await this.categoryService.all()
    const categoriesFormated = categories.map((category: any) => new CategoryDto(category))
    return inertia.render('admin/categories', { categories: CategoryDto.sortTree(categoriesFormated) })
  }
  async createCategory({ request, response }: HttpContext) {
    const { name, parentId, specsTypes } = request.only(['name', 'parentId', 'specsTypes'])
    await this.categoryService.create({ name, parentId, specsTypes })
    return response.redirect().toRoute('admin.categories')
  }
  async updateCategory({ request, response }: HttpContext) {
    const { name, parentId, specsTypes } = request.only(['name', 'parentId', 'specsTypes'])
    await this.categoryService.update(request.param('id'), { name, parentId, specsTypes })
    return response.redirect().toRoute('admin.categories')
  }
  async deleteCategory({ request, response }: HttpContext) {
    await this.categoryService.delete(request.param('id'))
    return response.redirect().toRoute('admin.categories')
  }

  async brands({ inertia }: HttpContext) {
    return inertia.render('admin/brands')
  }

  async users({ inertia }: HttpContext) {
    return inertia.render('admin/users')
  }

}
