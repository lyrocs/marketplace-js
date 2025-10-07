import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { UserService } from '#services/user_service'
import { DealService } from '#services/deal_service'
import UserDto from '#dtos/user'
import DealDto from '#dtos/deal'

@inject()
export default class UserController {
  constructor(
    private userService: UserService,
    private dealService: DealService
  ) {}

  // [GET] /user/:user-id
  async show({ inertia, params, request }: HttpContext) {
    const userId = params['user-id']
    const page = Number(request.qs().page) || 1

    try {
      const user = await this.userService.one(userId)
      const publishedDeals = await this.dealService.getUserPublishedDeals(userId, page)
      const stats = await this.getUserStats(userId)
      return inertia.render('user/show', {
        user: new UserDto(user),
        deals: DealDto.fromArray(Array.from(publishedDeals)),
        meta: publishedDeals.getMeta(),
        stats,
        currentPage: page,
      })
    } catch (error) {
      return inertia.render('errors/not_found', {
        message: 'Utilisateur non trouvé',
      })
    }
  }

  
  private async getUserStats(userId: string) {
    const userDeals = await this.dealService.byUser(userId)
    const totalDeals = userDeals.length
    const publishedDeals = userDeals.filter((deal) => deal.status === 'PUBLISHED').length
    const soldDeals = userDeals.filter((deal) => deal.status === 'SOLD').length
    const saleRate = publishedDeals > 0 ? Math.round((soldDeals / publishedDeals) * 100) : 0
    const firstDeal =
      userDeals.length > 0
        ? userDeals.reduce((earliest, deal) =>
            deal.createdAt < earliest.createdAt ? deal : earliest
          )
        : null
    return {
      totalDeals,
      publishedDeals,
      soldDeals,
      saleRate,
      memberSince: firstDeal?.createdAt || null,
    }
  }
}
