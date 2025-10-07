import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import UserDto from '#dtos/user'
import { DiscussionService } from '#services/discussion_service'
import DiscussionDto from '#dtos/discussion'

@inject()
export default class ChatController {
  constructor(private discussionService: DiscussionService) {}

  // [GET] /chat
  async list({ inertia, auth }: HttpContext) {
    const matrixHost = process.env.MATRIX_HOST
    const user = auth.user
    const discussions = await this.discussionService.getDiscussionsByUser(user?.id ?? '')
    return inertia.render('chat/list', {
      user: user ? new UserDto(user) : null,
      matrixHost,
      discussions: discussions.map((discussion) => new DiscussionDto(discussion)),
    })
  }

  // [POST] /chat/:id/read
  async read({ auth, request, response }: HttpContext) {
    const user = auth.user
    const discussionId = request.param('id')
    await this.discussionService.markAsRead(user?.id ?? '', Number(discussionId))
    return response.redirect().back()
  }
}
