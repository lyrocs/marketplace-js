import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import UserDto from '#dtos/user'
import { DiscussionService } from '#services/discussion_service'
import DiscussionDto from '#dtos/discussion'
import MessageDto from '#dtos/message'
import vine from '@vinejs/vine'

@inject()
export default class ChatController {
  constructor(private discussionService: DiscussionService) {}

  // [GET] /chat
  async list({ inertia, auth }: HttpContext) {
    const user = auth.user
    const discussions = await this.discussionService.getDiscussionsByUser(user?.id ?? '')
    return inertia.render('chat/list', {
      user: user ? new UserDto(user) : null,
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

  // [POST] /chat/:id/messages
  async send({ auth, request, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const discussionId = Number(params.id)
    const schema = vine.compile(vine.object({ body: vine.string().trim().minLength(1) }))
    const { body } = await request.validateUsing(schema)
    const message = await this.discussionService.createMessage(discussionId, user.id, body)
    if (request.accepts(['json'])) {
      return response.json(new MessageDto(message))
    }
    return response.redirect().back()
  }

  // [GET] /chat/:id/messages
  async messages({ auth, request, params, response }: HttpContext) {
    auth.getUserOrFail()
    const discussionId = Number(params.id)
    const afterId = request.qs().after ? Number(request.qs().after) : undefined
    const messages = await this.discussionService.getMessages(discussionId, afterId)
    return response.json(messages.map((m) => new MessageDto(m)))
  }
}
