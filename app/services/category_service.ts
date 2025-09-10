import Category from '#models/category'
import SpecType from '#models/spec_type'
export class CategoryService {
  async all() {
    const categories = await Category.query().preload('specTypes')
    return categories
  }
  async getByName(name: string) {
    const category = await Category.query().where('name', name).preload('specTypes').first()
    return category
  }
  async getById(id: number) {
    const category = await Category.query().where('id', id).preload('specTypes').firstOrFail()
    return category
  }
  async create(data: { name: string; parentId: number; specsTypes: string[] }) {
    const specTypes = await SpecType.query().whereIn('key', data.specsTypes).select('id')
    const categoryData = {
      name: data.name,
      parentId: data.parentId
    }
    const newCategory = await Category.create(categoryData)
    if (specTypes.length) {
      await newCategory.related('specTypes').attach(specTypes.map((specType: any) => specType.id))
    }
    return Category.findOrFail(newCategory.id)
  }
  async update(id: number, data: { name: string; parentId: number; specsTypes: string[] }) {
    const category = await Category.findOrFail(id)
    category.merge({
      name: data.name,
      parentId: data.parentId
    })
    await category.save()
    await category.related('specTypes').detach()
    const specTypes = await SpecType.query().whereIn('key', data.specsTypes).select('id')
    if (specTypes.length) {
      await category.related('specTypes').attach(specTypes.map((specType: any) => specType.id))
    }
    return Category.findOrFail(id)
  }

  async delete(id: number) {
    const category = await Category.findOrFail(id)
    await category.delete()
  }
}