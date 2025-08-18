import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { DateTime } from 'luxon'

export default class DealProduct extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare deal_id: number

  @column()
  declare product_id: number

  @column()
  declare quantity: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
