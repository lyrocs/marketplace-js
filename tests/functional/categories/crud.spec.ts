import { test } from '@japa/runner'
import { CategoryService } from '#services/category_service'
import { SpecTypeService } from '#services/spec_type_service'
import Category from '#models/category'
import SpecType from '#models/spec_type'
import { TestUtils } from '#tests/helpers/test-utils'

test.group('Categories CRUD', (group) => {
  let categoryService: CategoryService
  let specTypeService: SpecTypeService

  group.setup(async () => {
    categoryService = new CategoryService()
    specTypeService = new SpecTypeService()
  })

  group.teardown(async () => {
    await TestUtils.cleanup()
  })

  test('should create, read, update and delete category', async ({ assert }) => {
    // Create some spec types first
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

    // Test CREATE
    const categoryData = {
      name: 'Test Category',
      key: 'test-category',
      description: 'Test category description',
      image: 'test-image.jpg',
      parentId: null,
      specsTypes: ['COLOR', 'SIZE']
    }

    const category = await categoryService.create(categoryData)
    
    assert.isNotNull(category)
    assert.equal(category.name, 'Test Category')
    assert.equal(category.key, 'TEST-CATEGORY') // Should be uppercase
    assert.equal(category.description, 'Test category description')
    assert.equal(category.image, 'test-image.jpg')
    assert.isNull(category.parentId)
    assert.isTrue(category.id > 0)

    // Test READ - get by ID
    const retrievedCategory = await categoryService.getById(category.id)
    assert.equal(retrievedCategory.name, 'Test Category')
    assert.equal(retrievedCategory.key, 'TEST-CATEGORY')

    // Test READ - get by key
    const categoryByKey = await categoryService.getByKey('TEST-CATEGORY')
    assert.isNotNull(categoryByKey)
    assert.equal(categoryByKey?.name, 'Test Category')

    // Test READ - get all
    const allCategories = await categoryService.all()
    assert.isArray(allCategories)
    assert.isTrue(allCategories.length >= 1)
    
    // Find our category in the list
    const foundCategory = allCategories.find(c => c.id === category.id)
    assert.isNotNull(foundCategory)
    assert.equal(foundCategory?.name, 'Test Category')

    // Test UPDATE
    const updateData = {
      name: 'Updated Category',
      key: 'updated-category',
      description: 'Updated description',
      image: 'updated-image.jpg',
      parentId: null,
      specsTypes: ['COLOR'] // Remove SIZE spec type
    }

    const updatedCategory = await categoryService.update(category.id, updateData)
    
    assert.equal(updatedCategory.name, 'Updated Category')
    assert.equal(updatedCategory.key, 'UPDATED-CATEGORY')
    assert.equal(updatedCategory.description, 'Updated description')
    assert.equal(updatedCategory.image, 'updated-image.jpg')

    // Verify the update persisted
    const verifyCategory = await categoryService.getById(category.id)
    assert.equal(verifyCategory.name, 'Updated Category')
    assert.equal(verifyCategory.key, 'UPDATED-CATEGORY')

    // Test DELETE
    await categoryService.delete(category.id)
    
    // Verify category is deleted
    const deletedCategory = await Category.find(category.id)
    assert.isNull(deletedCategory)
  })

  test('should handle parent-child category relationship', async ({ assert }) => {
    // Create parent category
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

    // Verify parent-child relationship
    const retrievedChild = await categoryService.getById(childCategory.id)
    assert.equal(retrievedChild.parentId, parentCategory.id)
  })

  test('should handle category with spec types', async ({ assert }) => {
    // Create spec types
    const specType1 = await SpecType.create({
      label: 'Material',
      key: 'MATERIAL',
      description: 'string'
    })
    
    const specType2 = await SpecType.create({
      label: 'Weight',
      key: 'WEIGHT',
      description: 'number'
    })

    // Create category with spec types
    const category = await categoryService.create({
      name: 'Category with Specs',
      key: 'category-with-specs',
      description: 'Category with specifications',
      parentId: null,
      specsTypes: ['MATERIAL', 'WEIGHT']
    })

    // Load category with spec types
    const categoryWithSpecs = await Category.query()
      .where('id', category.id)
      .preload('specTypes')
      .firstOrFail()

    assert.isArray(categoryWithSpecs.specTypes)
    assert.lengthOf(categoryWithSpecs.specTypes, 2)
    
    const specKeys = categoryWithSpecs.specTypes.map(st => st.key)
    assert.include(specKeys, 'MATERIAL')
    assert.include(specKeys, 'WEIGHT')
  })

  test('should handle category without spec types', async ({ assert }) => {
    const category = await categoryService.create({
      name: 'Simple Category',
      key: 'simple-category',
      description: 'Simple category without specs',
      parentId: null,
      specsTypes: []
    })

    assert.equal(category.name, 'Simple Category')
    assert.equal(category.key, 'SIMPLE-CATEGORY')
    assert.isNull(category.parentId)

    // Load category with spec types (should be empty)
    const categoryWithSpecs = await Category.query()
      .where('id', category.id)
      .preload('specTypes')
      .firstOrFail()

    assert.isArray(categoryWithSpecs.specTypes)
    assert.lengthOf(categoryWithSpecs.specTypes, 0)
  })

  test('should handle category key transformation to uppercase', async ({ assert }) => {
    const category = await categoryService.create({
      name: 'Lowercase Key Category',
      key: 'lowercase-key',
      description: 'Category with lowercase key',
      parentId: null,
      specsTypes: []
    })

    assert.equal(category.key, 'LOWERCASE-KEY')
    
    // Verify we can find it by uppercase key
    const foundCategory = await categoryService.getByKey('LOWERCASE-KEY')
    assert.isNotNull(foundCategory)
    assert.equal(foundCategory?.id, category.id)
  })

  test('should handle updating category spec types', async ({ assert }) => {
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
      name: 'Update Test Category',
      key: 'update-test-category',
      description: 'Category for update testing',
      parentId: null,
      specsTypes: ['ORIGINAL_SPEC']
    })

    // Update category with different spec types
    const updatedCategory = await categoryService.update(category.id, {
      name: 'Updated Test Category',
      key: 'updated-test-category',
      description: 'Updated category description',
      parentId: null,
      specsTypes: ['NEW_SPEC']
    })

    // Load category with updated spec types
    const categoryWithSpecs = await Category.query()
      .where('id', category.id)
      .preload('specTypes')
      .firstOrFail()

    assert.equal(categoryWithSpecs.name, 'Updated Test Category')
    assert.isArray(categoryWithSpecs.specTypes)
    assert.lengthOf(categoryWithSpecs.specTypes, 1)
    assert.equal(categoryWithSpecs.specTypes[0].key, 'NEW_SPEC')
  })

  test('should handle non-existent category operations', async ({ assert }) => {
    const nonExistentId = 99999

    // Test getById with non-existent ID
    await assert.rejects(
      () => categoryService.getById(nonExistentId),
      'Row not found'
    )

    // Test update with non-existent ID
    await assert.rejects(
      () => categoryService.update(nonExistentId, {
        name: 'Non-existent',
        key: 'non-existent',
        parentId: null,
        specsTypes: []
      }),
      'Row not found'
    )

    // Test delete with non-existent ID
    await assert.rejects(
      () => categoryService.delete(nonExistentId),
      'Row not found'
    )
  })

  test('should handle getByKey with non-existent key', async ({ assert }) => {
    const nonExistentKey = 'NON-EXISTENT-KEY'
    
    const category = await categoryService.getByKey(nonExistentKey)
    assert.isNull(category)
  })
})
