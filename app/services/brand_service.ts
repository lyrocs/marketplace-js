import Brand from '#models/brand'

export class BrandService {
  async all() {
    const brands = await Brand.query()
    return brands
  }
  async create(data: { name: string }) {
    const existingBrand = await Brand.query().where('name', data.name).first()
    if (existingBrand) {
      return existingBrand
    }
    return Brand.create(data)
  }
}