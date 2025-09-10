import { BaseModelDto } from '@adocasts.com/dto/base'
import SpecType from '#models/spec_type'

export default class SpecTypeDto extends BaseModelDto {
  declare id: number
  declare key: string
  declare label: string
  declare description: string

  constructor(spec?: SpecType) {
    super()

    if (!spec) return
    this.id = spec.id
    this.key = spec.key
    this.label = spec.label
    this.description = spec.description
  }
}