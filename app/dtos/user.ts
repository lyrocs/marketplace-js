import { BaseModelDto } from '@adocasts.com/dto/base'
import User from '#models/user'

export default class UserDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare email: string
  declare password: string
  declare createdAt: string
  declare updatedAt: string | null

  declare meta: Record<string, any>

  constructor(user?: User) {
    super()

    if (!user) return
    this.id = user.id
    this.name = user.name
    this.email = user.email
    this.password = user.password
    this.createdAt = user.createdAt.toISO()!
    this.updatedAt = user.updatedAt?.toISO()!
    this.meta = user.$extras
  }
}
