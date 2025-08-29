import vine from '@vinejs/vine'

export const importValidator = vine.compile(
  vine.object({
    products: vine.array(
      vine.object({
        name: vine.string().trim().minLength(2),
        description: vine.string().trim(),
        features: vine.array(vine.object({
          title: vine.string().trim(),
          items: vine.array(vine.string().trim()),
        }).optional()),
        images: vine.array(vine.string()),
        manufacturer_name: vine.string().trim(),
        price: vine.number(),
        currency: vine.string(),
        specs: vine
          .array(
            vine.object({
              type: vine.string().trim(),
              value: vine.string().trim(),
            })
          )
          .optional(),
        available: vine.boolean(),
        shop: vine.string().trim(),
        language: vine.string().trim(),
        url: vine.string().trim(),
        category_name: vine.string().trim(),
      })
    ),
  })
)
