import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { loginValidator, registerValidator } from '#validators/auth'
import User from '#models/user'
import limiter from '@adonisjs/limiter/services/main'
import { UserService } from '#services/user_service'
import { UserRole } from '#models/user'


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
}
