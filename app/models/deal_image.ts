import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { DateTime } from 'luxon'
import Deal from './deal.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class DealImage extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare deal_id: number

  @column()
  declare url: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Deal, {
    foreignKey: 'deal_id',
  })
  declare deal: BelongsTo<typeof Deal>
}
