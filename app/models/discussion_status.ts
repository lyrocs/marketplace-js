import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class DiscussionStatus extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare discussionId: number

  @column()
  declare userId: string

  @column()
  declare newMessage: boolean
}
