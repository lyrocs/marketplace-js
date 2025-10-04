import { test } from '@japa/runner'
import { BrandService } from '#services/brand_service'
import Brand from '#models/brand'
import { TestUtils } from '#tests/helpers/test-utils'

test.group('BrandService - Focused Tests', (group) => {
  let brandService: BrandService

  group.setup(async () => {
    brandService = new BrandService()
  })

  group.teardown(async () => {
    await TestUtils.cleanup()
  })

  test('should create brand with unique name', async ({ assert }) => {
    const brandData = { name: 'Unique Brand Name' }
    
    const brand = await brandService.create(brandData)
    
    assert.equal(brand.name, 'Unique Brand Name')
    assert.isTrue(brand.id > 0)
  })

  test('should prevent duplicate brand creation', async ({ assert }) => {
    const brandName = 'Duplicate Test Brand'
    
    // Create first brand
    const firstBrand = await brandService.create({ name: brandName })
    
    // Try to create duplicate
    const secondBrand = await brandService.create({ name: brandName })
    
    // Should return the same brand
    assert.equal(firstBrand.id, secondBrand.id)
    assert.equal(firstBrand.name, secondBrand.name)
  })

  test('should retrieve all brands', async ({ assert }) => {
    // Create test brands
    await TestUtils.createMultipleBrands(3)
    
    const brands = await brandService.all()
    
    assert.isArray(brands)
    assert.isTrue(brands.length >= 3)
  })

  test('should update existing brand', async ({ assert }) => {
    const brand = await TestUtils.createBrand({ name: 'Original Name' })
    const newName = 'Updated Name'
    
    const updatedBrand = await brandService.update(brand.id, { name: newName })
    
    assert.equal(updatedBrand.id, brand.id)
    assert.equal(updatedBrand.name, newName)
  })

  test('should delete brand successfully', async ({ assert }) => {
    const brand = await TestUtils.createBrand({ name: 'To Delete' })
    
    await brandService.delete(brand.id)
    
    const deletedBrand = await Brand.find(brand.id)
    assert.isNull(deletedBrand)
  })

  test('should handle brand not found for update', async ({ assert }) => {
    const nonExistentId = 99999
    
    await assert.rejects(
      () => brandService.update(nonExistentId, { name: 'New Name' }),
      'Row not found'
    )
  })

  test('should handle brand not found for delete', async ({ assert }) => {
    const nonExistentId = 99999
    
    await assert.rejects(
      () => brandService.delete(nonExistentId),
      'Row not found'
    )
  })
})
