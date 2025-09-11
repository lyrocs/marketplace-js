import vine from '@vinejs/vine'

export const createDealValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(2),
    productId: vine.number(),
    description: vine.string().trim(),
    location: vine.string().trim(),
    currency: vine.string().trim(),
    price: vine.number(),
  })
)
export const createDraftDealValidator = vine.compile(
  vine.object({
    productId: vine.number(),
  })
)

export const updateDealValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(2).optional(),
    description: vine.string().trim().optional(),
    location: vine.string().trim().optional(),
    currency: vine.string().trim().optional(),
    price: vine.number().optional(),
    products: vine
      .array(
        vine.object({
          productId: vine.number(),
          quantity: vine.number(),
        })
      )
      .optional(),
  })
)

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2),
    categoryId: vine.number(),
    brandId: vine.number(),
  })
)
