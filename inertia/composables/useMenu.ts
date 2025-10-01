import CategoryDto from '#dtos/category'

export function useMenu({ categories }: { categories: CategoryDto[] }) {
  const parentCategories = categories.filter((category) => category.parentId === null)
  const menuParentCategories = parentCategories.map((category) => ({
    title: category.name,
    children: categories
      .filter((childCategory) => childCategory.parentId === category.id)
      .map((childCategory) => ({
        title: childCategory.name,
        href: `/products/${childCategory.key.toLowerCase()}`,
        image: childCategory.image,
        description: childCategory.description,
      })),
  }))

  return {
    menuParentCategories,
  }
}
