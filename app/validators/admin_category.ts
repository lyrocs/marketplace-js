import vine from '@vinejs/vine'
import { InferInput } from '@vinejs/vine/types'

export const adminCategoryValidator = vine.compile(
  vine.object({
        name: vine.string().trim().minLength(2),
        key: vine.string().trim().minLength(2),
        description: vine.string().trim().optional(),
        image: vine.string().trim().optional(),  
        parentId: vine.number().optional(),
        specsTypes: vine.array(vine.string()).optional(),
  })
)

export type AdminCategoryInput = InferInput<typeof adminCategoryValidator>
