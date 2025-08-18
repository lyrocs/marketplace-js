import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ProductQuad extends BaseModel {
  @column({ isPrimary: true })
  declare product_id: number

  @column({ isPrimary: true })
  declare quad_id: number
}