import { BaseModelDto } from '@adocasts.com/dto/base'
import Product from '#models/product'
import CategoryDto from '#dtos/category'
import SpecDto from '#dtos/spec'
import ShopDto from '#dtos/shop'
import BrandDto from '#dtos/brand'

export default class ProductDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare status: string
  declare category: CategoryDto
  declare brand: BrandDto
  declare images: string[]
  declare description?: string
  declare features?: { title: string; items: string[] }[]
  declare specs: SpecDto[]
  declare shops: ShopDto[]  

  constructor(product?: Product) {
    super()

    if (!product) return
    this.id = product.id
    this.name = product.name
    this.status = product.status
    this.category = product.category && new CategoryDto(product.category)
    this.brand = product.brand && new BrandDto(product.brand)
    this.images = product.images
    this.description = product.description
    this.features = product.features
    this.specs = product.specs && product.specs.map((spec) => new SpecDto(spec))
    this.shops = product.shops && product.shops.map((shop) => new ShopDto(shop))
  }
}