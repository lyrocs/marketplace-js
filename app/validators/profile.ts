import vine from '@vinejs/vine'

export const updateProfileValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    email: vine.string().trim().email().normalizeEmail(),
  })
)

export type UpdateProfileInput = typeof updateProfileValidator[typeof vine.TYPE]
