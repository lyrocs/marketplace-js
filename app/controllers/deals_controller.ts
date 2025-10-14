import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { CategoryService } from '#services/category_service'
import { SpecService } from '#services/spec_service'
import { ProductService } from '#services/product_service'
import { BrandService } from '#services/brand_service'
import CategoryDto from '#dtos/category'
import SpecDto from '#dtos/spec'
import ProductDto from '#dtos/product'
import BrandDto from '#dtos/brand'
import MetaDto from '#dtos/meta'
import { DealService } from '#services/deal_service'
import DealDto from '#dtos/deal'
import { updateDealValidator } from '#validators/deal'
import { createProductValidator } from '#validators/deal'
import drive from '@adonisjs/drive/services/main'
import { cuid } from '@adonisjs/core/helpers'
import { DiscussionService } from '#services/discussion_service'
import { MatrixContractService } from '#contracts/matrix_service'
import { UserService } from '#services/user_service'

@inject()
export default class DealsController {
  constructor(
    private categoryService: CategoryService,
    private specService: SpecService,
    private productService: ProductService,
    private brandService: BrandService,
    private dealService: DealService,
    private discussionService: DiscussionService,
    private matrix: MatrixContractService,
    private userService: UserService
  ) {}

  // [GET] /deals/:id
  async view({ inertia, params }: HttpContext) {
    const dealId = Number(params.id)
    const deal = await this.dealService.one(dealId)
    return inertia.render('deals/view', { deal: new DealDto(deal) })
  }

  // [GET] /deals/my
  async my({ inertia, auth }: HttpContext) {
    const userId = auth.user?.id || ''
    const deals = await this.dealService.byUser(userId)
    return inertia.render('deals/my', { deals: DealDto.fromArray(deals) })
  }

  // [GET] /deals/create
  async create({ auth, response }: HttpContext) {
    const userId = auth.user?.id || ''
    const deal = await this.dealService.create({
      user_id: userId,
    })
    return response.redirect().toRoute('deals.edit', { id: deal.id })
  }

  // [GET] /deals/:id/edit
  async edit({ inertia, params, request }: HttpContext) {
    const dealId = Number(params.id)
    const deal = await this.dealService.one(dealId)
    return inertia.render('deals/edit', {
      deal: new DealDto(deal),
      csrfToken: request.csrfToken,
    })
  }

  // [GET] /deals/:id/search-product
  async searchProduct({ inertia, request, params }: HttpContext) {
    const dealId = Number(params.id)
    const queryString = request.qs()
    const specs = queryString.specs?.split(',') || []
    const page = queryString.page || 1
    const specsIds = Array.isArray(specs) ? specs.map(Number) : [Number(specs)]
    const categories = await this.categoryService.all()
    let category
    let specsData
    if (queryString.category) {
      category = await this.categoryService.getById(Number(queryString.category))
      specsData = await this.specService.byTypes(
        category?.specTypes?.map((type: any) => type.key) as any
      )
    }
    const deal = await this.dealService.one(dealId)
    const products = await this.productService.byCategory({
      category: category?.id,
      specs: specsIds,
      page,
    })
    return inertia.render('deals/searchProduct', {
      categories: categories.map((category: any) => new CategoryDto(category)),
      specs: specsData?.map((spec: any) => new SpecDto(spec)),
      products: ProductDto.fromArray(Array.from(products)),
      meta: new MetaDto(products.getMeta()),
      deal: new DealDto(deal),
    })
  }

  // [POST] /deals/:id/add-product
  async addProduct({ request, response, params }: HttpContext) {
    const data = request.only(['product_id'])
    const dealId = Number(params.id)
    await this.dealService.addProduct({
      product_id: Number(data.product_id),
      deal_id: dealId,
    })
    return response.redirect().toRoute('deals.edit', { id: dealId })
  }

  // [POST] /deals/:id/images
  async addImages({ request, params, response }: HttpContext) {
    const images = request.files('images')
    let imagesData = []
    for (const image of images) {
      const key = `uploaded_images/${cuid()}.${image.extname}`
      await image.moveToDisk(key)
      const imageUrl = await drive.use().getUrl(key)
      await this.dealService.addImage(params.id, imageUrl)
      imagesData.push(imageUrl)
    }
    return response.json(imagesData)
  }

  // [DELETE] /deals/:id/images
  async deleteImages({ request, params }: HttpContext) {
    const data = request.all()
    const images = data.images
    for (const image of images) {
      const key = image.split('https://kwadmarket-images.s3.amazonaws.com/').pop()
      await drive.use().delete(key)
    }
    for (const imageUrl of images) {
      await this.dealService.deleteImage(params.id, imageUrl)
    }
    return images
  }

  // [POST] /deals/:id
  async update({ request, params, response }: HttpContext) {
    const data = request.all()
    const dealId = Number(params.id)
    const payload = await updateDealValidator.validate(data)
    await this.dealService.update(dealId, {
      title: payload.title,
      description: payload.description || '',
      location: payload.location || '',
      currency: payload.currency || '',
      price: payload.price,
      invoiceAvailable: payload.invoiceAvailable,
      sellingReason: payload.sellingReason,
      canBeDelivered: payload.canBeDelivered,
      features: payload.features || [],
      condition: payload.condition,
      products: payload.products || [],
    })
    response.redirect().back()
  }

  // [GET] /products/:category/deal
  async plp({ inertia, request, params, response }: HttpContext) {
    const categoryName = params.category.toUpperCase()
    const queryString = request.qs()
    const specs = queryString.specs?.split(',') || []
    const page = queryString.page || 1
    const specsIds = Array.isArray(specs) ? specs.map(Number) : [Number(specs)]
    const categories = await this.categoryService.all()
    const category = await this.categoryService.getByKey(categoryName)
    if (!category && categoryName !== 'ALL') {
      return response.redirect().back()
    }
    const specsData = await this.specService.byTypes(
      (category?.specTypes.map((specType: any) => specType.key) as any) || []
    )
    const deals = await this.dealService.search({
      category: category?.id || undefined,
      specs: specsIds,
      page,
    })

    return inertia.render('plp/index', {
      categories: categories.map((category: any) => new CategoryDto(category)),
      deals: DealDto.fromArray(Array.from(deals)),
      meta: new MetaDto(deals.getMeta()),
      specs: specsData.map((spec: any) => new SpecDto(spec)),
      category: params.category.toUpperCase(),
      isDeal: true,
    })
  }

  // [POST] /deals/:id/contact
  async contact({ auth, params, response }: HttpContext) {
    await auth.authenticate()
    if (!auth.isAuthenticated) {
      return null
    }
    const user = auth.getUserOrFail()
    const dealId = Number(params.id)
    const deal = await this.dealService.one(dealId)
    if (!deal) {
      return null
    }
    const sellerId = deal.user_id
    const seller = await this.userService.one(sellerId)
    if (!seller) {
      return null
    }
    const existingDiscussion = await this.discussionService.getDiscussion(dealId, user.id, sellerId)
    if (existingDiscussion) {
      return response.redirect().toRoute('chat.list')
    }

    const roomId = await this.matrix.createRoom({
      name: `Deal ${dealId} - ${sellerId} - ${user.name}`,
      buyerName: user.matrixLogin || '',
      sellerName: seller.matrixLogin || '',
    })
    const discussion = await this.discussionService.createDiscussion(
      dealId,
      user.id,
      sellerId,
      roomId
    )
    if (!discussion || !discussion.matrixRoomId) {
      return null
    }
    return response.redirect().toRoute('chat.list')
  }

  // [GET] /deals/:id/create-product
  async createProductPage({ inertia, params }: HttpContext) {
    const dealId = Number(params.id)
    const deal = await this.dealService.one(dealId)
    const categories = await this.categoryService.all()
    const specs = await this.specService.all()
    const brands = await this.brandService.all()

    return inertia.render('deals/createProduct', {
      deal: new DealDto(deal),
      categories: categories.map((category: any) => new CategoryDto(category)),
      specs: specs.map((spec: any) => new SpecDto(spec)),
      brands: brands.map((brand: any) => new BrandDto(brand)),
    })
  }

  // [POST] /deals/:id/create-product
  async createProduct({ request, response, params, session }: HttpContext) {
    try {
      const data = await request.validateUsing(createProductValidator)
      const dealId = Number(params.id)
      const productData = {
        ...data,
        category_id: data.categoryId,
        brand_id: data.brandId,
        status: 'DRAFT',
      }
      const product = await this.productService.create(productData)
      await this.dealService.addProduct({
        product_id: product.id,
        deal_id: dealId,
      })
      return response.redirect().toRoute('deals.edit', { id: dealId })
    } catch (error) {
      console.log(error)
      session.flashErrors(error.messages.map((message: any) => message.message).join(', '))
      return response.redirect().back()
    }
  }
}
