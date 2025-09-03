import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { DateTime } from 'luxon'

export default class ProductTranslation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare productId: number

  @column()
  declare language: string

  @column()
  declare name: string

  @column()
  declare description: string

  @column({
    prepare: (value) => JSON.stringify(value),
  })
  declare features: { title: string; items: string[] }[] | undefined

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}