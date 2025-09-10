import { BaseModelDto } from '@adocasts.com/dto/base'
import Spec from '#models/spec'
import SpecTypeDto from '#dtos/spec_type'

export default class SpecDto extends BaseModelDto {
  declare id: number
  declare type: SpecTypeDto
  declare spec_type_id: number | null
  declare value: string

  constructor(spec?: Spec) {
    super()

    if (!spec) return
    this.id = spec.id
    this.type = spec.type && new SpecTypeDto(spec.type)
    this.spec_type_id = spec.type && spec.type.id
    this.value = spec.value
  }
}