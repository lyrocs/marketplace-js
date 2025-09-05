import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { DateTime } from 'luxon'

export default class ProductComponent extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare parent_id: number

  @column()
  declare component_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
