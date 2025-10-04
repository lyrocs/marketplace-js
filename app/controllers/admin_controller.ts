import { inject } from '@adonisjs/core'
import { SpecService } from '#services/spec_service'
import { SpecTypeService } from '#services/spec_type_service'
import { ProductService } from '#services/product_service'
import { CategoryService } from '#services/category_service'
import { BrandService } from '#services/brand_service'
import { UserService } from '#services/user_service'
import { DealService } from '#services/deal_service'
import { adminProductValidator } from '#validators/admin_product'
import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import CategoryDto from '#dtos/category'
import BrandDto from '#dtos/brand'
import SpecDto from '#dtos/spec'
import UserDto from '#dtos/user'
import ProductDto from '#dtos/product'
import DealDto from '#dtos/deal'
import MetaDto from '#dtos/meta'
import SpecTypeDto from '#dtos/spec_type'
import { adminCategoryValidator } from '#validators/admin_category'
import drive from '@adonisjs/drive/services/main'
import crypto from 'node:crypto'
@inject()
export default class ImportController {
  constructor(
    private specService: SpecService,
    private specTypeService: SpecTypeService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private userService: UserService,
    private dealService: DealService
  ) {}

  async home({ inertia }: HttpContext) {
    return inertia.render('admin/home')
  }

  async deals({ inertia, request }: HttpContext) {
    const queryString = request.qs()
    const status = queryString.status || 'DRAFT'
    const page = queryString.page || 1
    
    const deals = await this.dealService.getPaginated({
      status,
      page: Number(page),
      limit: 20
    })
    
    return inertia.render('admin/deals', { deals: DealDto.fromArray(Array.from(deals)),  meta: new MetaDto(deals.getMeta()), })
  }

  async updateDealStatus({ params, request, response }: HttpContext) {
    const { id } = params
    const { status, reason } = request.only(['status', 'reason'])
    
    await this.dealService.updateStatus(Number(id), status, reason)
    
    return response.redirect().back()
  }

  async products({ inertia, request }: HttpContext) {
      const queryString = request.qs()
       const categories = await this.categoryService.all()
       let category
       let specsData
       if (queryString.category) {
        category = await this.categoryService.getById(Number(queryString.category))
        specsData = await this.specService.byTypes(category?.specTypes?.map((type: any) => type.key) as any)
       }
     
       const status = queryString.status || null
       const specs = queryString.specs?.split(',') || []
       const page = queryString.page || 1
       const specsIds = Array.isArray(specs) ? specs.map(Number) : [Number(specs)]
      
       const products = await this.productService.byCategory({ category: category?.id, specs: specsIds, page, status })
   
       return inertia.render('admin/products', {
         categories: categories.map((category: any) => new CategoryDto(category)),
         products: ProductDto.fromArray(Array.from(products)),
         meta: new MetaDto(products.getMeta()),
         specs: specsData?.map((spec: any) => new SpecDto(spec))
       })
  }
  // PRODUCT
  async product({ inertia, params }: HttpContext) {
    const product = await this.productService.one(Number(params.id))
    const specs = await this.specService.all()
    const categories = await this.categoryService.all()
    const brands = await this.brandService.all()
    const s3BaseUrl = env.get('S3_BASE_URL')
    return inertia.render('admin/product', { 
      product: new ProductDto(product), 
      specs: specs.map((spec: any) => new SpecDto(spec)), 
      categories: categories.map((category: any) => new CategoryDto(category)), 
      brands: brands.map((brand: any) => new BrandDto(brand)),
      s3BaseUrl
    })
  }

  async createProduct({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(adminProductValidator)
      const product = await this.productService.create(data)
      return response.redirect().toRoute('admin.product', { id: product.id })
    } catch (error) {
      return response.redirect().back()
    }
  }

  async createProductPage({ inertia }: HttpContext) {
    const specs = await this.specService.all()
    const categories = await this.categoryService.all()
    const brands = await this.brandService.all()
    return inertia.render('admin/product-create', { 
      specs: specs.map((spec: any) => new SpecDto(spec)), 
      categories: categories.map((category: any) => new CategoryDto(category)), 
      brands: brands.map((brand: any) => new BrandDto(brand)) 
    })
  }

  async uploadProductImage({ request, response, session }: HttpContext) {
    const { imageUrls } = request.only(['imageUrls'])
    const id = Number(request.param('id'))
    
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      const errorMsg = 'imageUrls is required and must be a non-empty array'
      session.flashErrors({ errorMsg })
      return response.redirect().back()
    }
    const filteredUrls = imageUrls.filter((url: string) => !url.includes(env.get('S3_BASE_URL')))
    if (filteredUrls.length === 0) {
      const errorMsg = 'No new images to upload'
      session.flashErrors({ errorMsg })
      return response.redirect().back()
    }
    try {
      const uploadedUrls = []
      const disk = drive.use()

      for (const imageUrl of filteredUrls) {
        const imageResponse = await fetch(imageUrl)
        if (!imageResponse.ok) {
          // Skip failed fetches or return an error
          console.warn(`Failed to fetch image: ${imageUrl}`)
          continue
        }

        const arrayBuffer = await imageResponse.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const fileName = `product/${id}/${crypto.randomBytes(16).toString('hex')}.jpg`

        await disk.put(fileName, buffer)
        const url = await disk.getUrl(fileName)
        uploadedUrls.push(url)
      }

      await this.productService.update(id, { images: uploadedUrls })
      return response.redirect().back()
    } catch (error) {
      console.error('Error uploading images:', error)
      return response.internalServerError({ error: 'Failed to upload images' })
    }
  }

  async updateProduct({ request, response }: HttpContext) {
    const data = await request.validateUsing(adminProductValidator)
    const id = Number(request.param('id'))
    await this.productService.one(id)
    const productData = {
      name: data.name,
      images: data.images,
      status: data.status,
      category_id: data.category_id,
      brand_id: data.brand_id,
      description: data.description,
      features: data.features || [],
    }
    await this.productService.update(id, productData)
    await this.productService.syncSpecs(await this.productService.one(id), data.specs)
    return response.redirect().toRoute('admin.product', { id })
  }
  // CATEGORY
  async categories({ inertia }: HttpContext) {
    const categories = await this.categoryService.all()
    const categoriesFormated = categories.map((category: any) => new CategoryDto(category))
    return inertia.render('admin/categories', { categories: CategoryDto.sortTree(categoriesFormated) })
  }
  async createCategory({ request, response, session }: HttpContext) {
    try {
      const data = await request.validateUsing(adminCategoryValidator)
      await this.categoryService.create(data)
      session.flash('success', 'Category created successfully')
      return response.redirect().toRoute('admin.categories')
    } catch (error) {
      session.flashErrors(error.messages.map((message: any) => message.message).join(', '))
      return response.redirect().back()
    }
  }
  async updateCategory({ request, response }: HttpContext) {
    const data = await request.validateUsing(adminCategoryValidator)
    await this.categoryService.update(request.param('id'), data)
    return response.redirect().toRoute('admin.categories')
  }
  async deleteCategory({ request, response }: HttpContext) {
    await this.categoryService.delete(request.param('id'))
    return response.redirect().toRoute('admin.categories')
  }
  // BRAND
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
  // SPEC
  async specs({ inertia }: HttpContext) {
    const specs = await this.specService.all()
    const types = await this.specService.allTypes()
    const specsFormated = specs.map((spec: any) => new SpecDto(spec))
    return inertia.render('admin/specs', { specs: specsFormated, types: types.map((type: any) => new SpecTypeDto(type)) })
  }
  async createSpec({ request, response }: HttpContext) {
    const { specTypeId, value } = request.only(['specTypeId', 'value'])
    await this.specService.create({ specTypeId, value })
    return response.redirect().toRoute('admin.specs')
  }
  async updateSpec({ request, response }: HttpContext) {
    const { specTypeId, value } = request.only(['specTypeId', 'value'])
    await this.specService.update(request.param('id'), { specTypeId, value })
    return response.redirect().toRoute('admin.specs')
  }
  async deleteSpec({ request, response }: HttpContext) {
    await this.specService.delete(request.param('id'))
    return response.redirect().toRoute('admin.specs')
  } 
  // SPEC TYPE
  async specTypes({ inertia }: HttpContext) {
    const types = await this.specTypeService.all()
    const typesFormated = types.map((type: any) => new SpecTypeDto(type))
    return inertia.render('admin/spec-types', { types: typesFormated })
  }
  async createSpecType({ request, response }: HttpContext) {
    const { key, label, description } = request.only(['key', 'label', 'description'])
    await this.specTypeService.create({ key, label, description })
    return response.redirect().toRoute('admin.spec-types')
  }
  async updateSpecType({ request, response }: HttpContext) {
    const { key, label, description } = request.only(['key', 'label', 'description'])
    await this.specTypeService.update(request.param('id'), { key, label, description })
    return response.redirect().toRoute('admin.spec-types')
  }
  async deleteSpecType({ request, response }: HttpContext) {
    await this.specTypeService.delete(request.param('id'))
    return response.redirect().toRoute('admin.spec-types')
  } 
  async users({ inertia }: HttpContext) {
    const users = await this.userService.all()
    const usersFormated = users.map((user: any) => new UserDto(user))
    return inertia.render('admin/users', { users: usersFormated })
  }
}
