import { BaseModelDto } from '@adocasts.com/dto/base'
import Discussion from '#models/discussion'

export default class DiscussionDto extends BaseModelDto {
  declare id: number
  declare dealId: number
  declare buyerId: string
  declare sellerId: string
  declare matrixRoomId: string
  declare createdAt: string
  declare updatedAt: string

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
  }
}