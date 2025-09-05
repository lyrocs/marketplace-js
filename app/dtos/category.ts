import { BaseModelDto } from '@adocasts.com/dto/base'
import Category from '#models/category'

export default class CategoryDto extends BaseModelDto {
  /**
   * Sorts categories so that each parent is immediately followed by its children (preorder traversal).
   */
  static sortTree(categories: CategoryDto[]): CategoryDto[] {
    const map = new Map<number | null, CategoryDto[]>();
    categories.forEach(cat => {
      if (!map.has(cat.parentId)) map.set(cat.parentId, []);
      map.get(cat.parentId)!.push(cat);
    });
    function traverse(parentId: number | null): CategoryDto[] {
      const children = map.get(parentId) || [];

      return children.flatMap(child => [child, ...traverse(child.id)]);
    }
    return traverse(null);
  }
  declare id: number
  declare name: string
  declare key: string
  declare specsTypes: string[]
  declare parentId: number | null

  constructor(category?: Category) {
    super()

    if (!category) return
    this.id = category.id
    this.name = category.name
    this.key = category.name.toUpperCase().replaceAll(' ','_')
    this.specsTypes = category.specsTypes
    this.parentId = category.parentId
  }
}