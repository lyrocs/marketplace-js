import { BaseModel, column, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import Product from './product.js'
import Discussion from './discussion.js'

export default class Deal extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: string

  @column()
  declare price: number

  @column()
  declare currency: string

  @column()
  declare location: string

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare status: string

  @column({
    prepare: (value) => JSON.stringify(value),
  })
  declare images: string[]

  @column()
  declare invoiceAvailable: boolean

  @column()
  declare sellingReason: string | null

  @column()
  declare canBeDelivered: boolean

  @column({
    prepare: (value) => JSON.stringify(value),
  })
  declare features: { label: string; value: string }[]

  @column()
  declare condition: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Product, {
    pivotTable: 'deal_products',
    pivotColumns: ['quantity'],
  })
  declare products: ManyToMany<typeof Product>

  @hasMany(() => Discussion, { foreignKey: 'deal_id' })
  declare discussions: HasMany<typeof Discussion>
}
