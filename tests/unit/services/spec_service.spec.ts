import { test } from '@japa/runner'
import { SpecService } from '#services/spec_service'
import Spec from '#models/spec'
import SpecType from '#models/spec_type'
import { TestUtils } from '#tests/helpers/test-utils'

test.group('SpecService', (group) => {
  let specService: SpecService

  group.setup(async () => {
    specService = new SpecService()
  })

  group.teardown(async () => {
    await TestUtils.cleanup()
  })

  test('should create a new spec', async ({ assert }) => {
    const specType = await SpecType.create({
      key: `color-${Date.now()}`,
      label: 'Color',
      description: 'Product color specification'
    })

    const specData = {
      specTypeId: specType.id,
      value: 'Red'
    }

    const spec = await specService.create(specData)

    assert.equal(spec.specTypeId, specData.specTypeId)
    assert.equal(spec.value, specData.value)
    assert.isTrue(spec.id > 0)
  })

  test('should return existing spec if already exists', async ({ assert }) => {
    const specType = await SpecType.create({
      key: `size-${Date.now()}`,
      label: 'Size',
      description: 'Product size specification'
    })

    const specData = {
      specTypeId: specType.id,
      value: 'Large'
    }

    // Create spec first time
    const spec1 = await specService.create(specData)
    
    // Try to create same spec again
    const spec2 = await specService.create(specData)

    assert.equal(spec1.id, spec2.id)
    assert.equal(spec1.value, spec2.value)
    assert.equal(spec1.specTypeId, spec2.specTypeId)
  })

  test('should get all specs', async ({ assert }) => {
    const specType1 = await SpecType.create({
      key: `color-${Date.now()}`,
      label: 'Color',
      description: 'Product color specification'
    })

    const specType2 = await SpecType.create({
      key: `size-${Date.now()}`,
      label: 'Size',
      description: 'Product size specification'
    })

    await specService.create({ specTypeId: specType1.id, value: 'Red' })
    await specService.create({ specTypeId: specType1.id, value: 'Blue' })
    await specService.create({ specTypeId: specType2.id, value: 'Large' })

    const specs = await specService.all()

    assert.isArray(specs)
    assert.isTrue(specs.length >= 3)
    
    // Check that specs have their types preloaded
    const specWithType = specs.find(s => s.type)
    assert.isNotNull(specWithType)
    assert.isNotNull(specWithType?.type)
  })

  test('should get all spec types', async ({ assert }) => {
    await SpecType.create({
      key: `color-${Date.now()}`,
      label: 'Color',
      description: 'Product color specification'
    })

    await SpecType.create({
      key: `size-${Date.now()}`,
      label: 'Size',
      description: 'Product size specification'
    })

    const types = await specService.allTypes()

    assert.isArray(types)
    assert.isTrue(types.length >= 2)
  })

  test('should get specs by types', async ({ assert }) => {
    const colorType = await SpecType.create({
      key: `color-${Date.now()}-${Math.random()}`,
      label: 'Color',
      description: 'Product color specification'
    })

    const sizeType = await SpecType.create({
      key: `size-${Date.now()}-${Math.random()}`,
      label: 'Size',
      description: 'Product size specification'
    })

    await specService.create({ specTypeId: colorType.id, value: 'Red' })
    await specService.create({ specTypeId: colorType.id, value: 'Blue' })
    await specService.create({ specTypeId: sizeType.id, value: 'Large' })

    const specs = await specService.byTypes([colorType.key])

    assert.isArray(specs)
    assert.isTrue(specs.length >= 2)
    
    // All specs should be of the color type
    specs.forEach(spec => {
      assert.equal(spec.specTypeId, colorType.id)
    })
  })

  test('should get specs by multiple types', async ({ assert }) => {
    const colorType = await SpecType.create({
      key: `color-${Date.now()}`,
      label: 'Color',
      description: 'Product color specification'
    })

    const sizeType = await SpecType.create({
      key: `size-${Date.now()}`,
      label: 'Size',
      description: 'Product size specification'
    })

    await specService.create({ specTypeId: colorType.id, value: 'Red' })
    await specService.create({ specTypeId: sizeType.id, value: 'Large' })

    const specs = await specService.byTypes([colorType.key, sizeType.key])

    assert.isArray(specs)
    assert.isTrue(specs.length >= 2)
    
    const specTypeIds = specs.map(s => s.specTypeId)
    assert.include(specTypeIds, colorType.id)
    assert.include(specTypeIds, sizeType.id)
  })

  test('should return empty array for non-existent types', async ({ assert }) => {
    const specs = await specService.byTypes(['non-existent-type'])

    assert.isArray(specs)
    assert.lengthOf(specs, 0)
  })

  test('should create many specs', async ({ assert }) => {
    const specsPayload = [
      { type: `color-${Date.now()}`, value: 'Red' },
      { type: `size-${Date.now()}`, value: 'Large' },
      { type: `material-${Date.now()}`, value: 'Cotton' }
    ]

    const specs = await specService.createMany(specsPayload)

    assert.isArray(specs)
    assert.lengthOf(specs, 3)
    
    // Check that all specs were created
    specs.forEach((spec, index) => {
      assert.equal(spec.value, specsPayload[index].value)
      assert.isTrue(spec.id > 0)
    })
  })

  test('should create spec types automatically when creating many specs', async ({ assert }) => {
    const typeKey = `auto-type-${Date.now()}`
    const specsPayload = [
      { type: typeKey, value: 'Value 1' },
      { type: typeKey, value: 'Value 2' }
    ]

    const specs = await specService.createMany(specsPayload)

    assert.isArray(specs)
    assert.lengthOf(specs, 2)
    
    // Check that spec type was created automatically
    const specType = await SpecType.query().where('key', typeKey).first()
    assert.isNotNull(specType)
    assert.equal(specType?.key, typeKey)
    assert.equal(specType?.label, typeKey)
  })

  test('should reuse existing spec types when creating many specs', async ({ assert }) => {
    const typeKey = `existing-type-${Date.now()}`
    
    // Create spec type first
    const existingType = await SpecType.create({
      key: typeKey,
      label: 'Existing Type',
      description: 'Existing type description'
    })

    const specsPayload = [
      { type: typeKey, value: 'Value 1' },
      { type: typeKey, value: 'Value 2' }
    ]

    const specs = await specService.createMany(specsPayload)

    assert.isArray(specs)
    assert.lengthOf(specs, 2)
    
    // Check that existing spec type was reused
    const specType = await SpecType.query().where('key', typeKey).first()
    assert.isNotNull(specType)
    assert.equal(specType?.id, existingType.id)
    assert.equal(specType?.label, 'Existing Type')
  })

  test('should update spec', async ({ assert }) => {
    const specType1 = await SpecType.create({
      key: `color-${Date.now()}`,
      label: 'Color',
      description: 'Product color specification'
    })

    const specType2 = await SpecType.create({
      key: `size-${Date.now()}`,
      label: 'Size',
      description: 'Product size specification'
    })

    const spec = await specService.create({
      specTypeId: specType1.id,
      value: 'Red'
    })

    const updateData = {
      specTypeId: specType2.id,
      value: 'Large'
    }

    const updatedSpec = await specService.update(spec.id, updateData)

    assert.equal(updatedSpec.id, spec.id)
    assert.equal(updatedSpec.specTypeId, updateData.specTypeId)
    assert.equal(updatedSpec.value, updateData.value)
  })

  test('should throw error when updating non-existent spec', async ({ assert }) => {
    const nonExistentId = 99999
    const updateData = {
      specTypeId: 1,
      value: 'Updated Value'
    }

    await assert.rejects(
      () => specService.update(nonExistentId, updateData),
      'Row not found'
    )
  })

  test('should delete spec', async ({ assert }) => {
    const specType = await SpecType.create({
      key: `color-${Date.now()}-${Math.random()}`,
      label: 'Color',
      description: 'Product color specification'
    })

    const spec = await specService.create({
      specTypeId: specType.id,
      value: 'Red'
    })

    const deletedSpec = await specService.delete(spec.id)

    // In AdonisJS, delete() returns undefined, so we just verify the operation completed
    assert.isUndefined(deletedSpec)
    
    // Verify spec was deleted
    const foundSpec = await Spec.find(spec.id)
    assert.isNull(foundSpec)
  })

  test('should throw error when deleting non-existent spec', async ({ assert }) => {
    const nonExistentId = 99999

    await assert.rejects(
      () => specService.delete(nonExistentId),
      'Row not found'
    )
  })

  test('should handle special characters in spec values', async ({ assert }) => {
    const specType = await SpecType.create({
      key: `special-${Date.now()}`,
      label: 'Special',
      description: 'Special characters specification'
    })

    const specialValue = 'Red & Blue (Premium) - "High Quality" €50'
    const spec = await specService.create({
      specTypeId: specType.id,
      value: specialValue
    })

    assert.equal(spec.value, specialValue)
  })

  test('should handle very long spec values', async ({ assert }) => {
    const specType = await SpecType.create({
      key: `long-${Date.now()}`,
      label: 'Long',
      description: 'Long value specification'
    })

    // Use 250 characters instead of 500 to stay within varchar(255) limit
    const longValue = 'A'.repeat(250)
    const spec = await specService.create({
      specTypeId: specType.id,
      value: longValue
    })

    assert.equal(spec.value, longValue)
  })

  test('should handle empty spec values', async ({ assert }) => {
    const specType = await SpecType.create({
      key: `empty-${Date.now()}`,
      label: 'Empty',
      description: 'Empty value specification'
    })

    const spec = await specService.create({
      specTypeId: specType.id,
      value: ''
    })

    assert.equal(spec.value, '')
  })

  test('should maintain data integrity when updating spec', async ({ assert }) => {
    const specType1 = await SpecType.create({
      key: `original-${Date.now()}`,
      label: 'Original',
      description: 'Original specification'
    })

    const specType2 = await SpecType.create({
      key: `updated-${Date.now()}`,
      label: 'Updated',
      description: 'Updated specification'
    })

    const originalSpec = await specService.create({
      specTypeId: specType1.id,
      value: 'Original Value'
    })

    const originalId = originalSpec.id
    const originalSpecTypeId = originalSpec.specTypeId

    const updateData = {
      specTypeId: specType2.id,
      value: 'Updated Value'
    }

    const updatedSpec = await specService.update(originalSpec.id, updateData)

    assert.equal(updatedSpec.id, originalId)
    assert.notEqual(updatedSpec.specTypeId, originalSpecTypeId)
    assert.equal(updatedSpec.specTypeId, updateData.specTypeId)
    assert.equal(updatedSpec.value, updateData.value)
  })

  test('should handle duplicate spec creation', async ({ assert }) => {
    const specType = await SpecType.create({
      key: `duplicate-${Date.now()}-${Math.random()}`,
      label: 'Duplicate',
      description: 'Duplicate specification'
    })

    const specData = {
      specTypeId: specType.id,
      value: 'Duplicate Value'
    }

    // Create spec first time
    const spec1 = await specService.create(specData)
    
    // Create same spec again (should return existing)
    const spec2 = await specService.create(specData)

    assert.equal(spec1.id, spec2.id)
    assert.equal(spec1.value, spec2.value)
    assert.equal(spec1.specTypeId, spec2.specTypeId)
    
    // Verify only one spec exists in database
    const allSpecs = await Spec.query().where('spec_type_id', specType.id).andWhere('value', 'Duplicate Value')
    assert.lengthOf(allSpecs, 1)
  })

  test('should handle mixed spec types in createMany', async ({ assert }) => {
    const existingType = await SpecType.create({
      key: `existing-${Date.now()}`,
      label: 'Existing Type',
      description: 'Existing type description'
    })

    const specsPayload = [
      { type: existingType.key, value: 'Existing Value' },
      { type: `new-type-${Date.now()}`, value: 'New Value' },
      { type: existingType.key, value: 'Another Existing Value' }
    ]

    const specs = await specService.createMany(specsPayload)

    assert.isArray(specs)
    assert.lengthOf(specs, 3)
    
    // Check that existing type was reused and new type was created
    const existingSpecs = specs.filter(s => s.specTypeId === existingType.id)
    const newSpecs = specs.filter(s => s.specTypeId !== existingType.id)
    
    assert.lengthOf(existingSpecs, 2)
    assert.lengthOf(newSpecs, 1)
  })

  test('should handle case-sensitive spec type keys', async ({ assert }) => {
    const typeKey = `CaseSensitive-${Date.now()}`
    const specsPayload = [
      { type: typeKey, value: 'Value 1' },
      { type: typeKey.toLowerCase(), value: 'Value 2' }
    ]

    const specs = await specService.createMany(specsPayload)

    assert.isArray(specs)
    assert.lengthOf(specs, 2)
    
    // Should create two different spec types due to case sensitivity
    const specTypeIds = specs.map(s => s.specTypeId)
    const uniqueTypeIds = [...new Set(specTypeIds)]
    assert.lengthOf(uniqueTypeIds, 2)
  })

  test('should preload type relation in byTypes', async ({ assert }) => {
    const specType = await SpecType.create({
      key: `preload-${Date.now()}`,
      label: 'Preload Test',
      description: 'Preload test specification'
    })

    await specService.create({
      specTypeId: specType.id,
      value: 'Preload Value'
    })

    const specs = await specService.byTypes([specType.key])

    assert.isArray(specs)
    assert.isTrue(specs.length >= 1)
    
    const spec = specs[0]
    assert.isNotNull(spec.type)
    assert.equal(spec.type.key, specType.key)
    assert.equal(spec.type.label, specType.label)
  })
})
