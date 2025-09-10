import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CategorySpecType extends BaseModel {
  @column({ isPrimary: true })
  declare categoryId: number

  @column({ isPrimary: true })
  declare specTypeId: number
}