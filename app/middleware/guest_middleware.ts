import type { Authenticators } from '@adonisjs/auth/types'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { inject } from '@adonisjs/core'
import { CategoryService } from '#services/category_service'
import CategoryDto from '#dtos/category'

@inject()
export default class GuestMiddleware {
  constructor(private categoryService: CategoryService) {}
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
        return next()
      }
    }

    return next()
  }
}
