import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import type { DateTime } from 'luxon'

export default class Account extends BaseModel {
  public static table = 'accounts'

  @column()
  declare user_id: string

  @column()
  declare type: string

  @column({ isPrimary: true })
  declare provider: string

  @column({ isPrimary: true })
  declare provider_account_id: string

  @column()
  declare refresh_token: string

  @column()
  declare access_token: string

  @column()
  declare expires_at: number

  @column()
  declare token_type: string

  @column()
  declare scope: string

  @column()
  declare id_token: string

  @column()
  declare session_state: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>
}