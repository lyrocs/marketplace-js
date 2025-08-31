import vine from '@vinejs/vine'

export const adminProductValidator = vine.compile(
  vine.object({
        name: vine.string().trim().minLength(2),
        status: vine.string().trim(),
        images: vine.array(vine.string()),
        specs: vine.array(vine.number()),
        category_id: vine.number(),
        brand_id: vine.number(),
        translations: vine.array(
          vine.object({
            id: vine.number().optional(),
            product_id: vine.number().optional(),
            name: vine.string().trim(),
            description: vine.string().trim(),
            features: vine.array(vine.object({
              title: vine.string().trim(),
              items: vine.array(vine.string().trim()),
            }).optional()),
            language: vine.string().trim(),
          })
        ).optional(),
  })
)
