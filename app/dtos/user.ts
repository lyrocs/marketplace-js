import { BaseModelDto } from '@adocasts.com/dto/base'
import User from '#models/user'
import UserRole from '#enums/roles'

export default class UserDto extends BaseModelDto {
  declare id: string
  declare name: string | null
  declare email: string
  declare image: string | null
  declare password: string
  declare matrixLogin: string | null
  declare matrixPassword: string | null
  declare createdAt: string
  declare updatedAt: string | null
  declare isAdmin: boolean

  declare meta: Record<string, any>

  constructor(user?: User) {
    super()

    if (!user) return
    this.id = user.id
    this.name = user.name
    this.email = user.email
    this.image = user.image
    this.password = user.password
    this.matrixLogin = user.matrixLogin ?? null
    this.matrixPassword = user.matrixPassword ?? null
    this.createdAt = user.createdAt.toISO()!
    this.updatedAt = user.updatedAt?.toISO()!
    this.isAdmin = user.role === UserRole.ADMIN
    this.meta = user.$extras
  }
}
