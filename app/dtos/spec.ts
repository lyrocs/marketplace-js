import { BaseModelDto } from '@adocasts.com/dto/base'
import Spec from '#models/spec'

export default class SpecDto extends BaseModelDto {
  declare id: number
  declare type: string
  declare value: string

  constructor(spec?: Spec) {
    super()

    if (!spec) return
    this.id = spec.id
    this.type = spec.type
    this.value = spec.value
  }
}