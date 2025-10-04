import { test } from '@japa/runner'
import { BrandService } from '#services/brand_service'
import { TestUtils } from '#tests/helpers/test-utils'

test.group('Posts create', (group) => {
  let brandService: BrandService

  group.setup(async () => {
    brandService = new BrandService()
  })

  group.teardown(async () => {
    await TestUtils.cleanup()
  })

  test('example test', async ({ assert }) => {
    const brand = await brandService.create({
      name: 'Test Brand',
    })
    assert.isNotNull(brand)
    assert.equal(brand.name, 'Test Brand')
    assert.isNotNull(brand.id)

    const updatedBrand = await brandService.update(brand.id, {
      name: 'Updated Brand',
    })
    assert.equal(updatedBrand.name, 'Updated Brand')
    assert.isNotNull(updatedBrand.id)

    const brands = await brandService.all()
    assert.equal(brands.length, 1)
    assert.equal(brands[0].name, 'Updated Brand')
    assert.isNotNull(brands[0].id)

    await brandService.delete(brand.id)
    const allBrands2 = await brandService.all()
    assert.equal(allBrands2.length, 0)
  })
})