import ProductDto from '#dtos/product'
import Product from '#models/product'

export default class DealProductDto extends ProductDto {
    declare quantity: number
  
    constructor(product?: Product, quantity?: number) {
      super(product)
      this.quantity = quantity || 0
    }
  }