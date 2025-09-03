import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Spec extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare type: string

  @column()
  declare value: string
}