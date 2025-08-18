import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column({
    prepare: value => JSON.stringify(value)
  })
  declare specsTypes: JSON

  @column()
  declare parentId: number | null

  @belongsTo(() => Category)
  declare parent: BelongsTo<typeof Category>
}