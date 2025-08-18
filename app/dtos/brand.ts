import { BaseModelDto } from '@adocasts.com/dto/base'
import Brand from '#models/brand'

export default class BrandDto extends BaseModelDto {
  declare id: number
  declare name: string

  constructor(brand?: Brand) {
    super()

    if (!brand) return
    this.id = brand.id
    this.name = brand.name
  }
}