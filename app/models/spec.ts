import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import SpecType from '#models/spec_type'

export default class Spec extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare specTypeId: number

  @column()
  declare value: string

  @belongsTo(() => SpecType)
  declare type: BelongsTo<typeof SpecType>
}