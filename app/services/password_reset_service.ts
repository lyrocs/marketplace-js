import { inject } from '@adonisjs/core'
import PasswordResetToken from '#models/password_reset_token'
import User from '#models/user'
import mail from '@adonisjs/mail/services/main'
import env from '#start/env'
import crypto from 'node:crypto'
import { DateTime } from 'luxon'

@inject()
export class PasswordResetService {
  async sendResetEmail(email: string): Promise<boolean> {
    try {
      const user = await User.findBy('email', email)
      if (!user) {
        // Do not reveal if the email exists or not for security reasons
        return true
      }
      await PasswordResetToken.query()
        .where('user_id', user.id)
        .whereNull('used_at')
        .where('expires_at', '>', DateTime.now().toJSDate())
        .delete()

      const token = crypto.randomBytes(32).toString('hex')
      const expiresAt = DateTime.now().plus({ hours: 1 })

      const resetToken = await PasswordResetToken.create({
        userId: user.id,
        token,
        expiresAt: expiresAt,
      })

      await mail.send((message) => {
        message
          .to(email)
          .from(process.env.SMTP_SENDER ?? '')
          .subject('Réinitialisation de votre mot de passe')
          .htmlView('emails/reset_password', {
            user: user,
            resetUrl: `${env.get('APP_URL')}/auth/reset-password/${resetToken.token}`,
            token: resetToken.token,
            expiresIn: '1 heure',
          })
      })
      return true
    } catch (error) {
      return false
    }
  }

  async validateToken(token: string): Promise<{ valid: boolean; user?: User; error?: string }> {
    try {
      const resetToken = await PasswordResetToken.query()
        .where('token', token)
        .whereNull('used_at')
        .preload('user')
        .first()

      if (!resetToken) {
        return { valid: false, error: 'Token invalide ou déjà utilisé' }
      }

      if (resetToken.isExpired()) {
        return { valid: false, error: 'Token expiré' }
      }

      return { valid: true, user: resetToken.user }
    } catch (error) {
      console.error('Erreur lors de la validation du token:', error)
      return { valid: false, error: 'Erreur lors de la validation du token' }
    }
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const validation = await this.validateToken(token)
      if (!validation.valid || !validation.user) {
        return { success: false, error: validation.error }
      }
      const user = validation.user
      const resetToken = await PasswordResetToken.query()
        .where('token', token)
        .whereNull('used_at')
        .first()
      if (!resetToken) {
        return { success: false, error: 'Token invalide' }
      }
      user.password = newPassword
      await user.save()
      resetToken.usedAt = DateTime.now()
      await resetToken.save()
      return { success: true }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error)
      return { success: false, error: 'Erreur lors de la réinitialisation du mot de passe' }
    }
  }
}
