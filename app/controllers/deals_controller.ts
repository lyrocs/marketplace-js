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
    private dealService: DealService,
    private discussionService: DiscussionService,
    private matrix: MatrixContractService,
    private userService: UserService,
  ) {}

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

  async edit({ inertia, params, request }: HttpContext) {
    const deal = await this.dealService.one(Number(params.id))
    return inertia.render('deals/edit', { deal: new DealDto(deal), csrfToken: request.csrfToken })
  }

  async searchProduct({ inertia, request, params }: HttpContext) {
    const queryString = request.qs()
    const categories = await this.categoryService.all()
    let category
    let specsData
    if (queryString.category) {
      category = await this.categoryService.getById(Number(queryString.category))
      specsData = await this.specService.byTypes(
        category?.specTypes?.map((type: any) => type.key) as any
      )
    }

    const specs = queryString.specs?.split(',') || []
    const page = queryString.page || 1
    const specsIds = Array.isArray(specs) ? specs.map(Number) : [Number(specs)]

    const deal = await this.dealService.one(Number(params.id))

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

  async addProduct({ request, response, params }: HttpContext) {
    const data = request.only(['product_id'])
    const dealId = Number(params.id)
    await this.dealService.addProduct({
      product_id: Number(data.product_id),
      deal_id: dealId,
    })
    return response.redirect().toRoute('deals.edit', { id: dealId })
  }

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
      invoiceAvailable: payload.invoiceAvailable,
      sellingReason: payload.sellingReason,
      canBeDelivered: payload.canBeDelivered,
      features: payload.features || [],
      condition: payload.condition,
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
    const specsData = await this.specService.byTypes(
      category.specTypes.map((specType: any) => specType.key) as any
    )
    const deals = await this.dealService.search({ category: category.id, specs: specsIds, page })

    return inertia.render('plp/index', {
      categories: categories.map((category: any) => new CategoryDto(category)),
      deals: DealDto.fromArray(Array.from(deals)),
      meta: new MetaDto(deals.getMeta()),
      specs: specsData.map((spec: any) => new SpecDto(spec)),
      category: params.category,
      isDeal: true,
    })
  }
  async contact({ auth, params, response }: HttpContext) {
    await auth.authenticate()
    if (!auth.isAuthenticated) {
      return null
    }
    const user = auth.getUserOrFail()
    const dealId = params.id
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
}
