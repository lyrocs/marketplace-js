import Category from '#models/category'

export class CategoryService {
  async all() {
    const categories = await Category.query()
    return categories
  }
  async getByName(name: string) {
    const category = await Category.query().where('name', name).first()
    return category
  }
  async getById(id: number) {
    const category = await Category.query().where('id', id).firstOrFail()
    return category
  }
  async create(data: { name: string; parentId: number; specsTypes: string[] }) {
    const newCategory = await Category.create(data)
    return Category.findOrFail(newCategory.id)
  }
  async update(id: number, data: { name: string; parentId: number; specsTypes: string[] }) {
    const category = await Category.findOrFail(id)
    category.merge(data)
    await category.save()
    return Category.findOrFail(id)
  }

  async delete(id: number) {
    const category = await Category.findOrFail(id)
    await category.delete()
  }
}