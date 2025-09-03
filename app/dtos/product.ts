import { BaseModelDto } from '@adocasts.com/dto/base'
import Product from '#models/product'
import CategoryDto from '#dtos/category'
import SpecDto from '#dtos/spec'
import ShopDto from '#dtos/shop'
import BrandDto from '#dtos/brand'
import ProductTranslationDto from '#dtos/product_translation'

export default class ProductDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare status: string
  declare category: CategoryDto
  declare brand: BrandDto
  declare images: string[]
  declare specs: SpecDto[]
  declare shops: ShopDto[]
  declare translations: ProductTranslationDto[]

  constructor(product?: Product) {
    super()

    if (!product) return
    this.id = product.id
    this.name = product.name
    this.status = product.status
    this.category = product.category && new CategoryDto(product.category)
    this.brand = product.brand && new BrandDto(product.brand)
    this.images = product.images
    this.specs = product.specs && product.specs.map((spec) => new SpecDto(spec))
    this.shops = product.sources && product.sources.map((source) => new ShopDto(source))
    this.translations = product.translations && product.translations.map((translation) => new ProductTranslationDto(translation))
  }
}