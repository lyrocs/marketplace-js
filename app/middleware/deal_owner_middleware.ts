import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Deal from '#models/deal'

export default class DealOwnerMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const dealId = ctx.params.id
    const userId = ctx.auth.user?.id

    if (!userId) {
      return ctx.response.redirect().toRoute('login')
    }

    try {
      const deal = await Deal.findOrFail(dealId)
      
      if (deal.user_id !== userId) {
        return ctx.response.redirect().toRoute('home');
      }

      // Store the deal in the context for use in the controller
      ctx.deal = deal
      
      await next()
    } catch (error) {
      return ctx.response.redirect().toRoute('home');
    }
  }
}
