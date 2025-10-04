import { test } from '@japa/runner'
import { CategoryService } from '#services/category_service'
import Category from '#models/category'
import SpecType from '#models/spec_type'

test.group('CategoryService Unit Tests', (group) => {
  let categoryService: CategoryService

  group.setup(async () => {
    categoryService = new CategoryService()
  })

  group.teardown(async () => {
    // Clean up test data
    await Category.query().delete()
    await SpecType.query().delete()
  })

  test('should create category with basic data', async ({ assert }) => {
    const categoryData = {
      name: 'Test Category',
      key: 'test-category',
      description: 'Test description',
      image: 'test.jpg',
      parentId: null,
      specsTypes: []
    }

    const category = await categoryService.create(categoryData)

    assert.equal(category.name, 'Test Category')
    assert.equal(category.key, 'TEST-CATEGORY') // Should be uppercase
    assert.equal(category.description, 'Test description')
    assert.equal(category.image, 'test.jpg')
    assert.isNull(category.parentId)
    assert.isTrue(category.id > 0)
  })

  test('should create category with spec types', async ({ assert }) => {
    // Create spec types first
    const specType1 = await SpecType.create({
      label: 'Color',
      key: 'COLOR',
      description: 'string'
    })
    
    const specType2 = await SpecType.create({
      label: 'Size',
      key: 'SIZE',
      description: 'string'
    })

    const categoryData = {
      name: 'Category with Specs',
      key: 'category-with-specs',
      description: 'Category with specifications',
      parentId: null,
      specsTypes: ['COLOR', 'SIZE']
    }

    const category = await categoryService.create(categoryData)

    assert.equal(category.name, 'Category with Specs')
    assert.equal(category.key, 'CATEGORY-WITH-SPECS')

    // Verify spec types are attached
    const categoryWithSpecs = await Category.query()
      .where('id', category.id)
      .preload('specTypes')
      .firstOrFail()

    assert.isArray(categoryWithSpecs.specTypes)
    assert.lengthOf(categoryWithSpecs.specTypes, 2)
    
    const specKeys = categoryWithSpecs.specTypes.map(st => st.key)
    assert.include(specKeys, 'COLOR')
    assert.include(specKeys, 'SIZE')
  })

  test('should create child category with parent', async ({ assert }) => {
    // Create parent category first
    const parentCategory = await categoryService.create({
      name: 'Parent Category',
      key: 'parent-category',
      description: 'Parent category',
      parentId: null,
      specsTypes: []
    })

    // Create child category
    const childCategory = await categoryService.create({
      name: 'Child Category',
      key: 'child-category',
      description: 'Child category',
      parentId: parentCategory.id,
      specsTypes: []
    })

    assert.equal(childCategory.parentId, parentCategory.id)
    assert.equal(childCategory.name, 'Child Category')
    assert.equal(childCategory.key, 'CHILD-CATEGORY')
  })

  test('should retrieve all categories', async ({ assert }) => {
    // Create test categories
    await categoryService.create({
      name: 'Category 1',
      key: 'category-1',
      description: 'First category',
      parentId: null,
      specsTypes: []
    })

    await categoryService.create({
      name: 'Category 2',
      key: 'category-2',
      description: 'Second category',
      parentId: null,
      specsTypes: []
    })

    const categories = await categoryService.all()

    assert.isArray(categories)
    assert.isTrue(categories.length >= 2)
    
    const categoryNames = categories.map(c => c.name)
    assert.include(categoryNames, 'Category 1')
    assert.include(categoryNames, 'Category 2')
  })

  test('should get category by ID', async ({ assert }) => {
    const category = await categoryService.create({
      name: 'Get By ID Category',
      key: 'get-by-id-category',
      description: 'Category for ID retrieval',
      parentId: null,
      specsTypes: []
    })

    const retrievedCategory = await categoryService.getById(category.id)

    assert.equal(retrievedCategory.id, category.id)
    assert.equal(retrievedCategory.name, 'Get By ID Category')
    assert.equal(retrievedCategory.key, 'GET-BY-ID-CATEGORY')
  })

  test('should get category by key', async ({ assert }) => {
    const category = await categoryService.create({
      name: 'Get By Key Category',
      key: 'get-by-key-category',
      description: 'Category for key retrieval',
      parentId: null,
      specsTypes: []
    })

    const retrievedCategory = await categoryService.getByKey('GET-BY-KEY-CATEGORY')

    assert.isNotNull(retrievedCategory)
    assert.equal(retrievedCategory.id, category.id)
    assert.equal(retrievedCategory.name, 'Get By Key Category')
  })

  test('should return null for non-existent key', async ({ assert }) => {
    const category = await categoryService.getByKey('NON-EXISTENT-KEY')
    assert.isNull(category)
  })

  test('should update category', async ({ assert }) => {
    const category = await categoryService.create({
      name: 'Original Category',
      key: 'original-category',
      description: 'Original description',
      parentId: null,
      specsTypes: []
    })

    const updateData = {
      name: 'Updated Category',
      key: 'updated-category',
      description: 'Updated description',
      image: 'updated.jpg',
      parentId: null,
      specsTypes: []
    }

    const updatedCategory = await categoryService.update(category.id, updateData)

    assert.equal(updatedCategory.id, category.id)
    assert.equal(updatedCategory.name, 'Updated Category')
    assert.equal(updatedCategory.key, 'UPDATED-CATEGORY')
    assert.equal(updatedCategory.description, 'Updated description')
    assert.equal(updatedCategory.image, 'updated.jpg')
  })

  test('should update category spec types', async ({ assert }) => {
    // Create spec types
    const specType1 = await SpecType.create({
      label: 'Original Spec',
      key: 'ORIGINAL_SPEC',
      description: 'string'
    })
    
    const specType2 = await SpecType.create({
      label: 'New Spec',
      key: 'NEW_SPEC',
      description: 'number'
    })

    // Create category with one spec type
    const category = await categoryService.create({
      name: 'Spec Update Category',
      key: 'spec-update-category',
      description: 'Category for spec update testing',
      parentId: null,
      specsTypes: ['ORIGINAL_SPEC']
    })

    // Update with different spec types
    const updatedCategory = await categoryService.update(category.id, {
      name: 'Updated Spec Category',
      key: 'updated-spec-category',
      description: 'Updated category',
      parentId: null,
      specsTypes: ['NEW_SPEC']
    })

    // Verify spec types were updated
    const categoryWithSpecs = await Category.query()
      .where('id', category.id)
      .preload('specTypes')
      .firstOrFail()

    assert.isArray(categoryWithSpecs.specTypes)
    assert.lengthOf(categoryWithSpecs.specTypes, 1)
    assert.equal(categoryWithSpecs.specTypes[0].key, 'NEW_SPEC')
  })

  test('should delete category', async ({ assert }) => {
    const category = await categoryService.create({
      name: 'To Delete Category',
      key: 'to-delete-category',
      description: 'Category to be deleted',
      parentId: null,
      specsTypes: []
    })

    await categoryService.delete(category.id)

    const deletedCategory = await Category.find(category.id)
    assert.isNull(deletedCategory)
  })

  test('should handle key case transformation', async ({ assert }) => {
    const category = await categoryService.create({
      name: 'Case Test Category',
      key: 'case-test-category',
      description: 'Category for case testing',
      parentId: null,
      specsTypes: []
    })

    assert.equal(category.key, 'CASE-TEST-CATEGORY')

    // Should be able to find by uppercase key
    const foundCategory = await categoryService.getByKey('CASE-TEST-CATEGORY')
    assert.isNotNull(foundCategory)
    assert.equal(foundCategory.id, category.id)
  })

  test('should handle parent ID conversion', async ({ assert }) => {
    const parentCategory = await categoryService.create({
      name: 'Parent for ID Test',
      key: 'parent-for-id-test',
      description: 'Parent category',
      parentId: null,
      specsTypes: []
    })

    const childCategory = await categoryService.create({
      name: 'Child for ID Test',
      key: 'child-for-id-test',
      description: 'Child category',
      parentId: parentCategory.id.toString(), // Pass as string
      specsTypes: []
    })

    assert.equal(childCategory.parentId, parentCategory.id)
    assert.isNumber(childCategory.parentId)
  })

  test('should handle null parent ID', async ({ assert }) => {
    const category = await categoryService.create({
      name: 'Null Parent Category',
      key: 'null-parent-category',
      description: 'Category with null parent',
      parentId: null,
      specsTypes: []
    })

    assert.isNull(category.parentId)
  })

  test('should throw error for non-existent category operations', async ({ assert }) => {
    const nonExistentId = 99999

    await assert.rejects(
      () => categoryService.getById(nonExistentId),
      'Row not found'
    )

    await assert.rejects(
      () => categoryService.update(nonExistentId, {
        name: 'Non-existent',
        key: 'non-existent',
        parentId: null,
        specsTypes: []
      }),
      'Row not found'
    )

    await assert.rejects(
      () => categoryService.delete(nonExistentId),
      'Row not found'
    )
  })
})
