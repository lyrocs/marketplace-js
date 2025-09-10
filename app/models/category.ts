import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import SpecType from '#models/spec_type'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare parentId: number | null

  @belongsTo(() => Category)
  declare parent: BelongsTo<typeof Category>

 @manyToMany(() => SpecType, {
    pivotTable: 'category_spec_types',
  })
  declare specTypes: ManyToMany<typeof SpecType>
}