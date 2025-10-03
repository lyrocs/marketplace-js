import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import UserRole from '#enums/roles'

/**
 * Admin middleware ensures only users with ADMIN role can access admin routes
 */
export default class AdminMiddleware {
  /**
   * The URL to redirect to when user is not an admin
   */
  redirectTo = '/'

  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user

    if (!user || user.role !== UserRole.ADMIN) {
      return ctx.response.redirect(this.redirectTo)
    }

    return next()
  }
}
