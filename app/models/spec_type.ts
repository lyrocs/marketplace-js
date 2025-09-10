import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class SpecType extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare key: string

  @column()
  declare label: string

  @column()
  declare description: string

}