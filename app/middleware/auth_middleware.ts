import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import { inject } from '@adonisjs/core'
import { CategoryService } from '#services/category_service'
import CategoryDto from '#dtos/category'
/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
@inject()
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/auth/login'

  constructor(
    private categoryService: CategoryService
) {}

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
    const categories = await this.categoryService.all()
    ctx.inertia.share({
      categories: categories.map((category: any) => new CategoryDto(category)),
    })
    return next()
  }
}