import { BaseModelDto } from '@adocasts.com/dto/base'
import Discussion from '#models/discussion'
import DealDto from '#dtos/deal'

export default class DiscussionDto extends BaseModelDto {
  declare id: number
  declare dealId: number
  declare buyerId: string
  declare sellerId: string
  declare matrixRoomId: string
  declare createdAt: string
  declare updatedAt: string
  declare deal: DealDto
  declare buyer: { id: string, name: string }
  declare seller: { id: string, name: string }

  constructor(discussion?: Discussion) {
    super()

    if (!discussion) return
    this.id = discussion.id
    this.dealId = discussion.dealId
    this.buyerId = discussion.buyerId
    this.sellerId = discussion.sellerId
    this.matrixRoomId = discussion.matrixRoomId
    this.createdAt = discussion.createdAt.toISO()!
    this.updatedAt = discussion.updatedAt.toISO()!
    this.deal = new DealDto(discussion.deal)
    this.buyer = { id: discussion.buyerId, name: discussion.buyer?.name || '' }
    this.seller = { id: discussion.sellerId, name: discussion.seller?.name || '' }
  }
}