import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import Category from '#models/category'
import ProductTranslation from '#models/product_translation'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Spec from '#models/spec'
import type { DateTime } from 'luxon'
import Source from '#models/source'
import Brand from '#models/brand'

export default class Product extends BaseModel {
  serializeExtras() {
    return {
      quantity: this.$extras.pivot_quantity,
    }
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare category_id: number

  @column()
  declare brand_id: number | null

  @column({
    prepare: (value) => JSON.stringify(value),
  })
  declare images: string[]

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Category, {
    foreignKey: 'category_id',
  })
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => Brand, {
    foreignKey: 'brand_id',
  })
  declare brand: BelongsTo<typeof Brand>

  @manyToMany(() => Spec, {
    pivotTable: 'product_specs',
  })
  declare specs: ManyToMany<typeof Spec>

  @hasMany(() => ProductTranslation)
  declare translations: HasMany<typeof ProductTranslation>

  @hasMany(() => Source)
  declare sources: HasMany<typeof Source>

  @manyToMany(() => Product, {
    pivotTable: 'product_components',
    localKey: 'id',
    pivotForeignKey: 'drone_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'component_id',
  })
  declare components: ManyToMany<typeof Product>

  @manyToMany(() => Product, {
    pivotTable: 'product_components',
    localKey: 'id',
    pivotForeignKey: 'component_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'drone_id',
  })
  declare usedIn: ManyToMany<typeof Product>
}
