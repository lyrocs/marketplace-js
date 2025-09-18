import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import UserDto from '#dtos/user'

@inject()
export default class ChatController {
  constructor() {}
  async list({ inertia, auth }: HttpContext) {
    const matrixHost = process.env.MATRIX_HOST
    const user = auth.user
    return inertia.render('chat/list', {      
      user: user ? new UserDto(user) : null,
      matrixHost,
    })
  }
}
