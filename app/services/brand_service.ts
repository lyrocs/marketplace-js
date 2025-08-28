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
  async update(id: number, data: { name: string }) {
    const brand = await Brand.findOrFail(id)
    brand.merge(data)
    return brand.save()
  }
  async delete(id: number) {
    const brand = await Brand.findOrFail(id)
    return brand.delete()
  }
}