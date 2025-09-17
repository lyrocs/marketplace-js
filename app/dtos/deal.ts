import { BaseModelDto } from '@adocasts.com/dto/base'
import Deal from '#models/deal'
import DealProductDto from '#dtos/deal_product'
import DiscussionDto from '#dtos/discussion'

export default class DealDto extends BaseModelDto {
  declare id: number
  declare user_id: string
  declare price: number
  declare currency: string
  declare location: string
  declare title: string
  declare description: string
  declare status: string
  declare createdAt: string
  declare updatedAt: string
  declare products: DealProductDto[]
  declare images: string[]
  declare discussions: DiscussionDto[]

  constructor(deal?: Deal) {
    super()

    if (!deal) return
    this.id = deal.id
    this.user_id = deal.user_id
    this.price = deal.price
    this.currency = deal.currency
    this.location = deal.location
    this.title = deal.title
    this.description = deal.description
    this.status = deal.status
    this.createdAt = deal.createdAt.toISO()!
    this.updatedAt = deal.updatedAt.toISO()!
    this.products = deal.products && deal.products.map((product) => new DealProductDto(product, product.$extras.pivot_quantity))
    this.images = deal.images || []
    this.discussions = DiscussionDto.fromArray(deal.discussions)
  }
}