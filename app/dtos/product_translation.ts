export default class ProductTranslationDto {
  declare id?: number
  declare productId?: number
  declare language?: string
  declare name?: string
  declare description?: string
  declare features?: object

  constructor(productTranslation?: ProductTranslationDto) {
    if (!productTranslation) return
    this.id = productTranslation.id
    this.productId = productTranslation.productId
    this.language = productTranslation.language
    this.name = productTranslation.name
    this.description = productTranslation.description
    this.features = productTranslation.features
  }
}
