import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { loginValidator, registerValidator } from '#validators/auth'
import User from '#models/user'
import limiter from '@adonisjs/limiter/services/main'
import { UserService } from '#services/user_service'
import UserRole from '#enums/roles'


@inject()
export default class HomeController {
  constructor(
    private userService: UserService
  ) {}

  get limit() {
    return limiter.use({
      requests: 10,
      duration: '3 hours',
      blockDuration: '24 hours',
    })
  }

  async login({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  async loginPost({ auth, session, request, response }: HttpContext) {
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
        return null
      }
      await auth.use('web').login(user, data.remember)
      return response.redirect().toRoute('home')
    
  }
  async register({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }
  async registerPost({ auth, request, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const firstUser = await this.userService.getFirst()
    const userData = {
      ...data,
      role: firstUser ? UserRole.USER : UserRole.ADMIN
    }
    const user = await User.create(userData)
    await auth.use('web').login(user)
    return response.redirect().toRoute('home')
  }

  async logout({ auth, session, response }: HttpContext) {
    await auth.use('web').logout()
    session.flash('success', 'Cya next time')
    return response.redirect().toRoute('home')
  }

  async verify({ auth }: HttpContext) {
    return auth.user?.email
  }

  async googleCallback({ auth, ally, response }: { ally: any; auth: any; response: any }) {
    const gh = ally.use('google')

    /**
     * User has denied access by canceling
     * the login flow
     */
    if (gh.accessDenied()) {
      return 'You have cancelled the login process'
    }

    /**
     * OAuth state verification failed. This happens when the
     * CSRF cookie gets expired.
     */
    if (gh.stateMisMatch()) {
      return 'We are unable to verify the request. Please try again'
    }

    /**
     * GitHub responded with some error
     */
    if (gh.hasError()) {
      return gh.getError()
    }

    /**
     * Access user info
     */
    const user = await gh.user()
    try {
      const existingAccount = await this.userService.getAccount(user.id)
      // replace true by  !!request.input('remember_me')
      await auth.use('web').login(existingAccount.user, true)
    } catch {
      // const matrixUser = await this.matrixService.createUser()
      // console.log('matrixUser', matrixUser)
      // if (!matrixUser) {
      //   return 'Unable to create matrix user'
      // }

      const newUser = await this.userService.createGoogleAccount(user, {})
      await auth.use('web').login(newUser, true)
    }
    return response.redirect().toRoute('home')
  }
}
