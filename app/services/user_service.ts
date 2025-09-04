import Account from '#models/account'
import User from '#models/user'

export class UserService {

  async all() {
    const users = await User.query()
    return users
  }

  // used to know if we have an admin user
  async getFirst() {
    const user = await User.query().first()
    return user
  }

  async getAccount(accoutId: number) {
    const account = await Account.query()
      .where('provider_account_id', accoutId)
      .preload('user')
      .firstOrFail()
    return account
  }

  async one(id: string) {
    const user = await User.query().where('id', id).firstOrFail()
    return user
  }

  async update(id: number, data: any) {
    const user = await User.findOrFail(id)
    user.merge(data)
    await user.save()
    return user
  }

  async createGoogleAccount(userData: any, matrixUser: any) {
    const user = await User.create({
      email: userData.email,
      name: userData.name,
      image: userData.image,
      matrixLogin: matrixUser?.username,
      matrixPassword: matrixUser?.password,
    })

    await Account.create({
      user_id: user.id,
      provider: 'google',
      provider_account_id: userData.id,
      access_token: userData.token.token,
      refresh_token: '',
      type: 'oauth',
      expires_at: userData.token.expires_at,
      token_type: 'oauth',
      scope: '',
      id_token: userData.token.id_token,
    })

    return user
  }
}
