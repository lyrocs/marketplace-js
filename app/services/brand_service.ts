import Brand from '#models/brand'

export class BrandService {
  async all() {
    const brands = await Brand.query()
    return brands
  }
  async create(data: { name: string }) {
    try {
      const existingBrand = await Brand.query().where('name', data.name).first()
      if (existingBrand) {
        return existingBrand
      }
      return await Brand.create(data)
    } catch (error) {
      if (error.code === '23505' || error.constraint === 'brands_name_unique') {
        return await Brand.query().where('name', data.name).firstOrFail()
      }
      throw error
    }
  }
  async update(id: number, data: { name: string }) {
    try {
      const existingBrand = await Brand.query().where('name', data.name).first()
      if (existingBrand && existingBrand.id !== id) {
        return existingBrand
      }
      const brand = await Brand.findOrFail(id)
      brand.merge(data)
      return await brand.save()
    } catch (error) {
      if (error.code === '23505' || error.constraint === 'brands_name_unique') {
        return await Brand.query().where('name', data.name).firstOrFail()
      }
      throw error
    }
  }
  async delete(id: number) {
    const brand = await Brand.findOrFail(id)
    return brand.delete()
  }
}