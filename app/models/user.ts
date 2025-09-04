import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, hasMany } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import Discussions from './discussion.js'
import DiscussionsStatus from './discussion_status.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import UserRole from '#enums/roles'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  public static table = 'users' // Correct table name

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string | null

  @column()
  declare email: string

  @column.dateTime()
  declare emailVerified: DateTime | null

  @column()
  declare image: string | null

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: UserRole

  @column()
  declare matrixLogin: string | null

  @column()
  declare matrixPassword: string | null

  @column()
  declare matrixToken: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Discussions, { foreignKey: 'buyer_id' })
  declare buyerDiscussions: HasMany<typeof Discussions>

  @hasMany(() => Discussions, { foreignKey: 'seller_id' })
  declare sellerDiscussions: HasMany<typeof Discussions>

  @hasMany(() => DiscussionsStatus, { foreignKey: 'user_id' })
  declare discussionStatus: HasMany<typeof DiscussionsStatus>

  @beforeCreate()
  public static assignUuid(user: User) {
    user.id = uuidv4()
  }
  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)
}
