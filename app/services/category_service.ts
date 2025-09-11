import Category from '#models/category'
import SpecType from '#models/spec_type'
import { AdminCategoryInput } from '#validators/admin_category'


export class CategoryService {
  async all() {
    const categories = await Category.query().preload('specTypes')
    return categories
  }
  async getByKey(key: string) {
    const category = await Category.query().where('key', key).preload('specTypes').first()
    return category
  }
  async getById(id: number) {
    const category = await Category.query().where('id', id).preload('specTypes').firstOrFail()
    return category
  }
  async create(data: AdminCategoryInput) {
    const specTypes = await SpecType.query().whereIn('key', data.specsTypes).select('id')
    delete data.specsTypes
    const categoryData = {
      ...data,
      key: data.key.toUpperCase(),
      parentId: data.parentId ? Number(data.parentId) : null,
    }
    const newCategory = await Category.create(categoryData)
    if (specTypes.length) {
      await newCategory.related('specTypes').attach(specTypes.map((specType: any) => specType.id))
    }
    return Category.findOrFail(newCategory.id)
  }
  async update(id: number, data: AdminCategoryInput) {
    const category = await Category.findOrFail(id)
    const newSpecsTypes = data.specsTypes
    delete data.specsTypes
    category.merge({
     ...data,
      key: data.key.toUpperCase(),
      parentId: data.parentId ? Number(data.parentId) : null,
    })
    await category.save()
    await category.related('specTypes').detach()
    const specTypes = await SpecType.query().whereIn('key', newSpecsTypes).select('id')
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