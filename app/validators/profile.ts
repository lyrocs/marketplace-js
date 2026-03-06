import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const updateProfileValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    email: vine.string().trim().email().normalizeEmail(),
  })
)

export type UpdateProfileInput = Infer<typeof updateProfileValidator>
