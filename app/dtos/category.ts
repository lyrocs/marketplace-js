import { BaseModelDto } from '@adocasts.com/dto/base'
import Category from '#models/category'

export default class CategoryDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare specsTypes: JSON
  declare parentId: number | null

  constructor(category?: Category) {
    super()

    if (!category) return
    this.id = category.id
    this.name = category.name
    this.specsTypes = category.specsTypes
    this.parentId = category.parentId
  }
}