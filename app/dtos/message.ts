import { BaseModelDto } from '@adocasts.com/dto/base'
import Message from '#models/message'

export default class MessageDto extends BaseModelDto {
  declare id: number
  declare discussionId: number
  declare senderId: string
  declare body: string
  declare createdAt: string

  constructor(message?: Message) {
    super()

    if (!message) return
    this.id = message.id
    this.discussionId = message.discussionId
    this.senderId = message.senderId
    this.body = message.body
    this.createdAt = message.createdAt.toISO()!
  }
}
