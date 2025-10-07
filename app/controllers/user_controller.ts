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

  /**
   * Afficher le profil public d'un utilisateur avec ses annonces
   */
  async show({ inertia, params, request }: HttpContext) {
    const userId = params['user-id']
    const page = Number(request.qs().page) || 1
    
    try {
      // Récupérer les informations de l'utilisateur
      const user = await this.userService.one(userId)
      
      // Récupérer les deals publiés de l'utilisateur avec pagination
      const publishedDeals = await this.dealService.getUserPublishedDeals(userId, page)
      
      // Récupérer quelques statistiques
      const stats = await this.getUserStats(userId)
      
      return inertia.render('user/show', {
        user: new UserDto(user),
        deals: DealDto.fromArray(Array.from(publishedDeals)),
        meta: publishedDeals.getMeta(),
        stats,
        currentPage: page
      })
    } catch (error) {
      // Si l'utilisateur n'existe pas, rediriger vers 404
      return inertia.render('errors/not_found', { 
        message: 'Utilisateur non trouvé' 
      })
    }
  }

  /**
   * Récupérer les statistiques d'un utilisateur
   */
  private async getUserStats(userId: string) {
    const userDeals = await this.dealService.byUser(userId)
    
    const totalDeals = userDeals.length
    const publishedDeals = userDeals.filter(deal => deal.status === 'PUBLISHED').length
    const soldDeals = userDeals.filter(deal => deal.status === 'SOLD').length
    
    // Calculer le taux de vente (en pourcentage)
    const saleRate = publishedDeals > 0 ? Math.round((soldDeals / publishedDeals) * 100) : 0
    
    // Date du premier deal
    const firstDeal = userDeals.length > 0 
      ? userDeals.reduce((earliest, deal) => 
          deal.createdAt < earliest.createdAt ? deal : earliest
        )
      : null
    
    return {
      totalDeals,
      publishedDeals,
      soldDeals,
      saleRate,
      memberSince: firstDeal?.createdAt || null
    }
  }
}
