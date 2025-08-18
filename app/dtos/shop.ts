import { BaseModelDto } from '@adocasts.com/dto/base'
import Shop from '#models/source'

export default class ShopDto extends BaseModelDto {
  declare id: number
  declare productId: number
  declare url: string
  declare price: number
  declare currency: string
  declare available: boolean
  declare shop: string

  constructor(shop?: Shop) {
    super()

    if (!shop) return
    this.id = shop.id
    this.productId = shop.productId
    this.url = shop.url
    this.price = shop.price
    this.currency = shop.currency
    this.available = shop.available
    this.shop = shop.shop
  }
}