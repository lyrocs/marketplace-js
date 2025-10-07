import vine from '@vinejs/vine'

export const adminDealUpdateStatusValidator = vine.compile(
  vine.object({
        status: vine.string().trim().minLength(2),
        reason: vine.string().trim().optional(),
  })
)
