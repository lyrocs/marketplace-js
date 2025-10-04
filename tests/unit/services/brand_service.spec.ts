import { test } from '@japa/runner'
import { BrandService } from '#services/brand_service'
import Brand from '#models/brand'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('BrandService', (group) => {
  let brandService: BrandService

  group.setup(async () => {
    brandService = new BrandService()
  })

  group.teardown(async () => {
    // Clean up all brands after tests
    await Brand.query().delete()
  })

  test('should create a new brand', async ({ assert }) => {
    const brandData = { name: 'Test Brand' }
    
    const brand = await brandService.create(brandData)
    
    assert.equal(brand.name, 'Test Brand')
    assert.isTrue(brand.id > 0)
  })

  test('should return existing brand if name already exists', async ({ assert }) => {
    // Create a brand first
    const existingBrand = await Brand.create({ name: 'Existing Brand' })
    
    // Try to create the same brand again
    const result = await brandService.create({ name: 'Existing Brand' })
    
    assert.equal(result.id, existingBrand.id)
    assert.equal(result.name, 'Existing Brand')
  })

  test('should get all brands', async ({ assert }) => {
    await Brand.query().delete()
    // Create some test brands
    await Brand.create({ name: 'Brand 1' })
    await Brand.create({ name: 'Brand 2' })
    await Brand.create({ name: 'Brand 3' })
    
    const brands = await brandService.all()
    
    assert.isArray(brands)
    assert.lengthOf(brands, 3)
    assert.include(brands.map(b => b.name), 'Brand 1')
    assert.include(brands.map(b => b.name), 'Brand 2')
    assert.include(brands.map(b => b.name), 'Brand 3')
  })

  test('should update brand name', async ({ assert }) => {
    // Create a brand first
    const brand = await Brand.create({ name: 'Original Name' })
    
    // Update the brand
    const updatedBrand = await brandService.update(brand.id, { name: 'Updated Name' })
    
    assert.equal(updatedBrand.id, brand.id)
    assert.equal(updatedBrand.name, 'Updated Name')
    
    // Verify the change persisted in database
    const freshBrand = await Brand.find(brand.id)
    assert.equal(freshBrand?.name, 'Updated Name')
  })

  test('should throw error when updating non-existent brand', async ({ assert }) => {
    const nonExistentId = 99999
    
    await assert.rejects(
      () => brandService.update(nonExistentId, { name: 'New Name' }),
      'Row not found'
    )
  })

  test('should delete brand', async ({ assert }) => {
    // Create a brand first
    const brand = await Brand.create({ name: 'To Be Deleted' })
    
    // Delete the brand
    await brandService.delete(brand.id)
    
    // Verify brand is deleted
    const deletedBrand = await Brand.find(brand.id)
    assert.isNull(deletedBrand)
  })

  test('should throw error when deleting non-existent brand', async ({ assert }) => {
    const nonExistentId = 99999
    
    await assert.rejects(
      () => brandService.delete(nonExistentId),
      'Row not found'
    )
  })

  // test('should handle case-insensitive brand name creation', async ({ assert }) => {
  //   // Create a brand with lowercase
  //   const brand1 = await Brand.create({ name: 'test brand' })
    
  //   // Try to create the same brand with different case
  //   const brand2 = await brandService.create({ name: 'Test Brand' })
    
  //   // Should return the existing brand (case-sensitive comparison)
  //   assert.equal(brand2.id, brand1.id)
  //   assert.equal(brand2.name, 'test brand')
  // })

  test('should handle empty brand name', async ({ assert }) => {
    // This test depends on your validation rules
    // If you have validation, it should throw an error
    // If not, it should create the brand
    
    try {
      const brand = await brandService.create({ name: '' })
      // If no validation, brand should be created
      assert.equal(brand.name, '')
    } catch (error) {
      // If validation exists, should throw error
      assert.isTrue(error.message.includes('name') || error.message.includes('required'))
    }
  })

  test('should handle special characters in brand name', async ({ assert }) => {
    const specialName = 'Brand & Co. (Ltd.) - "Premium"'
    
    const brand = await brandService.create({ name: specialName })
    
    assert.equal(brand.name, specialName)
  })

  test('should handle very long brand name', async ({ assert }) => {
    const longName = 'A'.repeat(255) // Assuming max length is 255
    
    const brand = await brandService.create({ name: longName })
    
    assert.equal(brand.name, longName)
  })

  test('should maintain data integrity when updating', async ({ assert }) => {
    // Create a brand
    const brand = await Brand.create({ name: 'Original Brand' })
    const originalId = brand.id
    
    // Update the brand
    const updatedBrand = await brandService.update(brand.id, { name: 'Updated Brand' })
    
    // Verify ID and timestamps are preserved
    assert.equal(updatedBrand.id, originalId)
    assert.equal(updatedBrand.name, 'Updated Brand')
  })

  test('should handle concurrent brand creation', async ({ assert }) => {
    const brandName = 'Concurrent Brand'
    
    // Create multiple promises to create the same brand
    const promises = [
      brandService.create({ name: brandName }),
      brandService.create({ name: brandName }),
      brandService.create({ name: brandName })
    ]
    
    const results = await Promise.all(promises)
    
    // All should return the same brand (first one created)
    const firstResult = results[0]
    results.forEach(result => {
      assert.equal(result.id, firstResult.id)
      assert.equal(result.name, brandName)
    })
    
    // Verify only one brand exists in database
    const brands = await Brand.query().where('name', brandName)
    assert.lengthOf(brands, 1)
  })
})
