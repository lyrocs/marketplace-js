import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { loginValidator, registerValidator } from '#validators/auth'
import User from '#models/user'
import limiter from '@adonisjs/limiter/services/main'
import { UserService } from '#services/user_service'
import UserRole from '#enums/roles'
import { MatrixContractService } from '#contracts/matrix_service'
import { PasswordResetService } from '#services/password_reset_service'
import { forgotPasswordValidator, resetPasswordValidator } from '#validators/password_reset'

@inject()
export default class HomeController {
  constructor(
    private matrixService: MatrixContractService,
    private userService: UserService,
    private passwordResetService: PasswordResetService
  ) {}

  get limit() {
    return limiter.use({
      requests: 10,
      duration: '3 hours',
      blockDuration: '24 hours',
    })
  }

  // [GET] /auth/login
  async login({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  // [POST] /auth/login
  async loginPost({ auth, session, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(loginValidator)
      const key = `login_${request.ip()}_${data.email}`
      const [error, user] = await this.limit.penalize(key, () => {
        return User.verifyCredentials(data.email, data.password)
      })

      if (error) {
        session.flashAll()
        session.flashErrors({
          E_TOO_MANY_REQUESTS: 'Too many login attempts, please try again later',
        })
        return response.redirect().back()
      }
      await auth.use('web').login(user, data.remember)
      return response.redirect().toRoute('home')
    } catch (error) {
      session.flashErrors({ errorMsg: 'Invalid email or password' })
      return response.redirect().back()
    }
  }

  // [GET] /auth/register
  async register({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  // [POST] /auth/register
  async registerPost({ auth, request, response, session }: HttpContext) {
    try {
      const data = await request.validateUsing(registerValidator)
      const firstUser = await this.userService.getFirst()
      const userData = {
        ...data,
        role: firstUser ? UserRole.USER : UserRole.ADMIN,
      }
      const user = await User.create(userData)
      await auth.use('web').login(user)
      const matrixUser = await this.matrixService.createUser()
      if (!matrixUser) {
        return 'Unable to create matrix user'
      }
      const newUser = await this.userService.update(user.id, {
        matrixLogin: matrixUser.username,
        matrixPassword: matrixUser.password,
      })
      await auth.use('web').login(newUser)
      return response.redirect().toRoute('home')
    } catch (error) {
      session.flashErrors({ errorMsg: 'Invalid email or password' })
      return response.redirect().back()
    }
  }

  // [GET] /auth/forgot-password
  async forgotPassword({ inertia }: HttpContext) {
    return inertia.render('auth/forgot-password')
  }

  // [POST] /auth/forgot-password
  async sendResetEmail({ request, response, session }: HttpContext) {
    try {
      const { email } = await request.validateUsing(forgotPasswordValidator)
      const emailSent = await this.passwordResetService.sendResetEmail(email)
      if (emailSent) {
        session.flash('success', true)
      } else {
        throw new Error('Something went wrong')
      }
      return response.redirect().back()
    } catch (error) {
      session.flashErrors({ errorMsg: 'Une erreur est survenue. Veuillez réessayer.' })
      return response.redirect().back()
    }
  }

  // [GET] /auth/reset-password/:token
  async resetPassword({ inertia, params }: HttpContext) {
    const token = params.token
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

  // [POST] /auth/reset-password
  async updatePassword({ request, response, session }: HttpContext) {
    try {
      const data = await request.validateUsing(resetPasswordValidator)
      const result = await this.passwordResetService.resetPassword(data.token, data.password)
      if (result.success) {
        session.flash('success', true)
        return response.redirect().toRoute('auth.login')
      } else {
        throw new Error('Something went wrong')
      }
    } catch (error) {
      session.flashErrors({ errorMsg: 'Une erreur est survenue. Veuillez réessayer.' })
      return response.redirect().back()
    }
  }

  // [POST] /auth/logout
  async logout({ auth, session, response }: HttpContext) {
    await auth.use('web').logout()
    session.flash('success', 'Cya next time')
    return response.redirect().toRoute('home')
  }

  // [GET] /auth/verify
  async verify({ auth }: HttpContext) {
    return auth.user?.email
  }

  // [GET] /google/callback
  async googleCallback({ auth, ally, response, inertia }: HttpContext) {
    try {
      const gh = ally.use('google')

      if (gh.accessDenied()) {
        return 'You have cancelled the login process'
      }

      if (gh.stateMisMatch()) {
        return 'We are unable to verify the request. Please try again'
      }

      if (gh.hasError()) {
        return gh.getError()
      }

      const user = await gh.user()
      try {
        const existingAccount = await this.userService.getAccount(user.id)
        // replace true by  !!request.input('remember_me')
        await auth.use('web').login(existingAccount.user, true)
      } catch {
        const matrixUser = await this.matrixService.createUser()
        if (!matrixUser) {
          return 'Unable to create matrix user'
        }
        const newUser = await this.userService.createGoogleAccount(user, matrixUser)
        await auth.use('web').login(newUser, true)
      }
      return response.redirect().toRoute('home')
    } catch (error) {
      let errorMsg = 'Une erreur est survenue. Veuillez réessayer.'
      if (error.code === '23505' || error.constraint === 'users_email_unique') {
        errorMsg =
          'Cette adresse email est déjà utilisée, veuillez vous connecter avec votre email et mot de passe.'
      }
      return inertia.render('auth/login', {
        errors: {
          errorMsg,
        },
      })
    }
  }
}
