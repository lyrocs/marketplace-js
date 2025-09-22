import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import type { DateTime } from 'luxon'
import Deal from '#models/deal'
import User from '#models/user'
import DiscussionStatus from '#models/discussion_status'

export default class Discussion extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare dealId: number

  @column()
  declare buyerId: string

  @column()
  declare sellerId: string

  @column()
  declare matrixRoomId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Deal)
  declare deal: BelongsTo<typeof Deal>

  @belongsTo(() => User, { foreignKey: 'buyerId' })
  declare buyer: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'sellerId' })
  declare seller: BelongsTo<typeof User>

  @hasMany(() => DiscussionStatus, { foreignKey: 'discussionId' })
  declare status: HasMany<typeof DiscussionStatus>
}
