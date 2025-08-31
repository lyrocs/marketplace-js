import { inject } from '@adonisjs/core'
import { SpecService } from '#services/spec_service'
import { ProductService } from '#services/product_service'
import { CategoryService } from '#services/category_service'
import { BrandService } from '#services/brand_service'
import { UserService } from '#services/user_service'
import { importValidator } from '#validators/import'
import { adminProductValidator } from '#validators/admin_product'
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

  async products({ inertia, request, params, response }: HttpContext) {
      const queryString = request.qs()
       const categories = await this.categoryService.all()
       let category
       let specsData
       if (queryString.category) {
        category = await this.categoryService.getById(Number(queryString.category))
        specsData = await this.specService.byTypes(category?.specsTypes as any)
       }
     
       const specs = queryString.specs?.split(',') || []
       const page = queryString.page || 1
       const specsIds = Array.isArray(specs) ? specs.map(Number) : [Number(specs)]
      
       const products = await this.productService.byCategory({ category: category?.id, specs: specsIds, page })
   
       return inertia.render('admin/products', {
         categories: categories.map((category: any) => new CategoryDto(category)),
         products: ProductDto.fromArray(Array.from(products)),
         meta: new MetaDto(products.getMeta()),
         specs: specsData?.map((spec: any) => new SpecDto(spec))
       })
  }

  async product({ inertia, params }: HttpContext) {
    const product = await this.productService.one(Number(params.id))
    const specs = await this.specService.all()
    const categories = await this.categoryService.all()
    const brands = await this.brandService.all()
    return inertia.render('admin/product', { 
      product: new ProductDto(product), 
      specs: specs.map((spec: any) => new SpecDto(spec)), 
      categories: categories.map((category: any) => new CategoryDto(category)), 
      brands: brands.map((brand: any) => new BrandDto(brand)) 
    })
  }

  async updateProduct({ inertia, params, request, response }: HttpContext) {
    const data = await request.validateUsing(adminProductValidator)
    const id = Number(request.param('id'))
    const product = await this.productService.one(id)
    const productData = {
      name: data.name,
      images: data.images,
      status: data.status,
      category_id: data.category_id,
      brand_id: data.brand_id,
    }

    for (const translation of data.translations) {  
      if (translation.id) {
        const translationData = {
          id: translation.id,
          product_id: id,
          language: translation.language,
          name: translation.name,
          description: translation.description,
          features: translation.features || {},
        }
        await this.productService.updateTranslation(translationData)
      }
      else {
        const translationData = {
          product_id: id,
          language: translation.language,
          name: translation.name,
          description: translation.description,
          features: translation.features || {},
        }
        await this.productService.createTranslation(translationData)
      }
    }
    for (const translation of product.translations) {
      if (!data.translations.some(t => t.id === translation.id)) {
        await this.productService.deleteTranslation(translation.id)
      }
    }
    await this.productService.update(id, productData)
    await this.productService.syncSpecs(await this.productService.one(id), data.specs)
    return response.redirect().toRoute('admin.product', { id })
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
