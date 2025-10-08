import vine from '@vinejs/vine'

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string().trim().minLength(32),
    password: vine.string().trim().minLength(8).confirmed(),
    password_confirmation: vine.string().trim().minLength(8),
  })
)
