import type { Authenticators } from '@adonisjs/auth/types'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { inject } from '@adonisjs/core'
import { CategoryService } from '#services/category_service'
import CategoryDto from '#dtos/category'
/**
 * Guest middleware is used to deny access to routes that should
 * be accessed by unauthenticated users.
 *
 * For example, the login page should not be accessible if the user
 * is already logged-in
 */
@inject()
export default class GuestMiddleware {
  constructor(
    private categoryService: CategoryService
) {}
  /**
   * The URL to redirect to when user is logged-in
   */
  redirectTo = '/'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { guards?: (keyof Authenticators)[] } = {}
  ) {
    const categories = await this.categoryService.all()
    ctx.inertia.share({
      categories: categories.map((category: any) => new CategoryDto(category)),
    })
    for (let guard of options.guards || [ctx.auth.defaultGuard]) {
      if (await ctx.auth.use(guard).check()) {
        // return ctx.response.redirect(this.redirectTo, true)
        return next()
      }
    }

    return next()
  }
}
