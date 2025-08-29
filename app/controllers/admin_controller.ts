import { inject } from '@adonisjs/core'
import { SpecService } from '#services/spec_service'
import { ProductService } from '#services/product_service'
import { CategoryService } from '#services/category_service'
import { BrandService } from '#services/brand_service'
import { UserService } from '#services/user_service'
import { importValidator } from '#validators/import'
import type { HttpContext } from '@adonisjs/core/http'
import CategoryDto from '#dtos/category'
import BrandDto from '#dtos/brand'
import SpecDto from '#dtos/spec'
import UserDto from '#dtos/user'
import ProductDto from '#dtos/product'
import MetaDto from '#dtos/meta'
@inject()
export default class ImportController {
  constructor(
    private specService: SpecService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private userService: UserService
  ) {}

  async home({ inertia }: HttpContext) {
    return inertia.render('admin/home')
  }

  async products({ inertia, request }: HttpContext) {
    const queryString = request.qs()
    const page = queryString.page || 1
    const products = await this.productService.all({ page })
    const productsFormated = ProductDto.fromArray(Array.from(products))
    return inertia.render('admin/products', { products: productsFormated, meta: new MetaDto(products.getMeta()) })
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
    const brands = await this.brandService.all()
    const brandsFormated = brands.map((brand: any) => new BrandDto(brand))
    return inertia.render('admin/brands', { brands: brandsFormated })
  }
  async createBrand({ request, response }: HttpContext) {
    const { name } = request.only(['name'])
    await this.brandService.create({ name })
    return response.redirect().toRoute('admin.brands')
  }
  async updateBrand({ request, response }: HttpContext) {
    const { name } = request.only(['name'])
    await this.brandService.update(request.param('id'), { name })
    return response.redirect().toRoute('admin.brands')
  }
  async deleteBrand({ request, response }: HttpContext) {
    await this.brandService.delete(request.param('id'))
    return response.redirect().toRoute('admin.brands')
  }

  async specs({ inertia }: HttpContext) {
    const specs = await this.specService.all()
    const specsFormated = specs.map((spec: any) => new SpecDto(spec))
    return inertia.render('admin/specs', { specs: specsFormated })
  }
  async createSpec({ request, response }: HttpContext) {
    const { type, value } = request.only(['type', 'value'])
    await this.specService.create({ type, value })
    return response.redirect().toRoute('admin.specs')
  }
  async updateSpec({ request, response }: HttpContext) {
    const { type, value } = request.only(['type', 'value'])
    await this.specService.update(request.param('id'), { type, value })
    return response.redirect().toRoute('admin.specs')
  }
  async deleteSpec({ request, response }: HttpContext) {
    await this.specService.delete(request.param('id'))
    return response.redirect().toRoute('admin.specs')
  } 

  async users({ inertia }: HttpContext) {
    const users = await this.userService.all()
    const usersFormated = users.map((user: any) => new UserDto(user))
    return inertia.render('admin/users', { users: usersFormated })
  }

}
