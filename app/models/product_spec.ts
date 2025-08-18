import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ProductSpec extends BaseModel {
  @column({ isPrimary: true })
  declare productId: number

  @column({ isPrimary: true })
  declare specId: number
}