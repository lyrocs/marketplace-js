import env from '#start/env'
import { defineConfig, services } from '@adonisjs/ally'

const allyConfig = defineConfig({
  google: services.google({
    clientId: env.get('GOOGLE_CLIENT_ID'),
    clientSecret: env.get('GOOGLE_CLIENT_SECRET'),
    callbackUrl: env.get('APP_URL') + '/google/callback',
  }),
  facebook: services.facebook({
    clientId: env.get('FACEBOOK_CLIENT_ID'),
    clientSecret: env.get('FACEBOOK_CLIENT_SECRET'),
    callbackUrl: env.get('APP_URL') + '/facebook/callback',

    // Facebook specific
    scopes: ['email'],
    userFields: ['first_name', 'email'],
    display: '',
    authType: '',
  }),
})

export default allyConfig

declare module '@adonisjs/ally/types' {
  interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}
