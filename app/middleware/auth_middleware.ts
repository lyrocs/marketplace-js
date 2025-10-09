import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import { inject } from '@adonisjs/core'
import { DiscussionService } from '#services/discussion_service'

@inject()
export default class AuthMiddleware {
  redirectTo = '/auth/login'
  constructor(private discussionService: DiscussionService) {}
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
    const unreadMessagesCount = await this.discussionService.countNewMessages(
      ctx.auth.user?.id || ''
    )
    ctx.inertia.share({
      unreadMessagesCount,
    })
    return next()
  }
}
