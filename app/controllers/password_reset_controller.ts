import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { PasswordResetService } from '#services/password_reset_service'
import { forgotPasswordValidator, resetPasswordValidator } from '#validators/password_reset'

@inject()
export default class PasswordResetController {
  constructor(private passwordResetService: PasswordResetService) {}

  /**
   * Affiche la page de réinitialisation de mot de passe (protégée par token)
   */
  async resetPassword({ inertia, params }: HttpContext) {
    const token = params.token

    // Valider le token
    const validation = await this.passwordResetService.validateToken(token)

    if (!validation.valid) {
      return inertia.render('auth/reset-password', {
        error: validation.error,
        invalidToken: true,
      })
    }

    return inertia.render('auth/reset-password', {
      token,
      user: validation.user,
    })
  }

  /**
   * Traite la réinitialisation du mot de passe
   */
  async updatePassword({ request, response, session }: HttpContext) {
    try {
      const data = await request.validateUsing(resetPasswordValidator)

      // Réinitialiser le mot de passe
      const result = await this.passwordResetService.resetPassword(data.token, data.password)

      if (result.success) {
        session.flash(
          'success',
          'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.'
        )
        return response.redirect().toRoute('auth.login')
      } else {
        session.flash(
          'error',
          result.error || 'Une erreur est survenue lors de la réinitialisation.'
        )
        return response.redirect().back()
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error)
      session.flash('error', 'Une erreur est survenue. Veuillez réessayer.')
      return response.redirect().back()
    }
  }
}
