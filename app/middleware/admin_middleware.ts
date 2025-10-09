import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import UserRole from '#enums/roles'

export default class AdminMiddleware {
  redirectTo = '/'
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user
    if (!user || user.role !== UserRole.ADMIN) {
      return ctx.response.redirect(this.redirectTo)
    }
    return next()
  }
}
