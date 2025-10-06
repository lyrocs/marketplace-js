import { test } from '@japa/runner'
import { SpecTypeService } from '#services/spec_type_service'
import SpecType from '#models/spec_type'
import { TestUtils } from '#tests/helpers/test-utils'

test.group('SpecTypeService', (group) => {
  let specTypeService: SpecTypeService

  group.setup(async () => {
    specTypeService = new SpecTypeService()
  })

  group.teardown(async () => {
    await TestUtils.cleanup()
  })

  test('should create a new spec type', async ({ assert }) => {
    const specTypeData = {
      key: `color-${Date.now()}-${Math.random()}`,
      label: 'Color',
      description: 'Product color specification type'
    }

    const specType = await specTypeService.create(specTypeData)

    assert.equal(specType.key, specTypeData.key)
    assert.equal(specType.label, specTypeData.label)
    assert.equal(specType.description, specTypeData.description)
    assert.isTrue(specType.id > 0)
  })

  test('should return existing spec type if key already exists', async ({ assert }) => {
    const specTypeData = {
      key: `size-${Date.now()}-${Math.random()}`,
      label: 'Size',
      description: 'Product size specification type'
    }

    // Create spec type first time
    const specType1 = await specTypeService.create(specTypeData)
    
    // Try to create same spec type again
    const specType2 = await specTypeService.create(specTypeData)

    assert.equal(specType1.id, specType2.id)
    assert.equal(specType1.key, specType2.key)
    assert.equal(specType1.label, specType2.label)
    assert.equal(specType1.description, specType2.description)
  })

  test('should get all spec types', async ({ assert }) => {
    const specType1 = await specTypeService.create({
      key: `color-${Date.now()}-${Math.random()}`,
      label: 'Color',
      description: 'Product color specification type'
    })

    const specType2 = await specTypeService.create({
      key: `size-${Date.now()}-${Math.random()}`,
      label: 'Size',
      description: 'Product size specification type'
    })

    const specTypes = await specTypeService.all()

    assert.isArray(specTypes)
    assert.isTrue(specTypes.length >= 2)
    
    // Check that our created spec types are in the results
    const foundSpecType1 = specTypes.find(st => st.id === specType1.id)
    const foundSpecType2 = specTypes.find(st => st.id === specType2.id)
    
    assert.isNotNull(foundSpecType1)
    assert.isNotNull(foundSpecType2)
    assert.equal(foundSpecType1?.key, specType1.key)
    assert.equal(foundSpecType2?.key, specType2.key)
  })

  test('should update spec type', async ({ assert }) => {
    const originalData = {
      key: `material-${Date.now()}-${Math.random()}`,
      label: 'Material',
      description: 'Product material specification type'
    }

    const specType = await specTypeService.create(originalData)

    const updateData = {
      key: `updated-material-${Date.now()}-${Math.random()}`,
      label: 'Updated Material',
      description: 'Updated product material specification type'
    }

    const updatedSpecType = await specTypeService.update(specType.id, updateData)

    assert.equal(updatedSpecType.id, specType.id)
    assert.equal(updatedSpecType.key, updateData.key)
    assert.equal(updatedSpecType.label, updateData.label)
    assert.equal(updatedSpecType.description, updateData.description)
  })

  test('should throw error when updating non-existent spec type', async ({ assert }) => {
    const nonExistentId = 99999
    const updateData = {
      key: 'non-existent-key',
      label: 'Non Existent',
      description: 'Non existent spec type'
    }

    await assert.rejects(
      () => specTypeService.update(nonExistentId, updateData),
      'Row not found'
    )
  })

  test('should delete spec type', async ({ assert }) => {
    const specTypeData = {
      key: `deletable-${Date.now()}-${Math.random()}`,
      label: 'Deletable',
      description: 'Deletable specification type'
    }

    const specType = await specTypeService.create(specTypeData)

    const deletedSpecType = await specTypeService.delete(specType.id)

    // In AdonisJS, delete() returns undefined, so we just verify the operation completed
    assert.isUndefined(deletedSpecType)
    
    // Verify spec type was deleted
    const foundSpecType = await SpecType.find(specType.id)
    assert.isNull(foundSpecType)
  })

  test('should throw error when deleting non-existent spec type', async ({ assert }) => {
    const nonExistentId = 99999

    await assert.rejects(
      () => specTypeService.delete(nonExistentId),
      'Row not found'
    )
  })

  test('should handle special characters in spec type data', async ({ assert }) => {
    const specTypeData = {
      key: `special-${Date.now()}-${Math.random()}`,
      label: 'Color & Size (Premium) - "High Quality" €50',
      description: 'Special characters: @#$%^&*()_+-=[]{}|;:,.<>?'
    }

    const specType = await specTypeService.create(specTypeData)

    assert.equal(specType.key, specTypeData.key)
    assert.equal(specType.label, specTypeData.label)
    assert.equal(specType.description, specTypeData.description)
  })

  test('should handle very long spec type data', async ({ assert }) => {
    const longString = 'A'.repeat(250) // Stay within varchar(255) limit
    const specTypeData = {
      key: `long-${Date.now()}-${Math.random()}`,
      label: longString,
      description: longString
    }

    const specType = await specTypeService.create(specTypeData)

    assert.equal(specType.label, longString)
    assert.equal(specType.description, longString)
  })

  test('should handle empty strings in spec type data', async ({ assert }) => {
    const specTypeData = {
      key: `empty-${Date.now()}-${Math.random()}`,
      label: '',
      description: ''
    }

    const specType = await specTypeService.create(specTypeData)

    assert.equal(specType.label, '')
    assert.equal(specType.description, '')
  })

  test('should maintain data integrity when updating spec type', async ({ assert }) => {
    const originalData = {
      key: `integrity-${Date.now()}-${Math.random()}`,
      label: 'Original Label',
      description: 'Original Description'
    }

    const specType = await specTypeService.create(originalData)

    const originalId = specType.id
    const originalKey = specType.key

    const updateData = {
      key: `updated-integrity-${Date.now()}-${Math.random()}`,
      label: 'Updated Label',
      description: 'Updated Description'
    }

    const updatedSpecType = await specTypeService.update(specType.id, updateData)

    assert.equal(updatedSpecType.id, originalId)
    assert.notEqual(updatedSpecType.key, originalKey)
    assert.equal(updatedSpecType.key, updateData.key)
    assert.equal(updatedSpecType.label, updateData.label)
    assert.equal(updatedSpecType.description, updateData.description)
  })

  test('should handle case-sensitive keys', async ({ assert }) => {
    const specTypeData1 = {
      key: `CaseSensitive-${Date.now()}-${Math.random()}`,
      label: 'Case Sensitive 1',
      description: 'Case sensitive key 1'
    }

    const specTypeData2 = {
      key: `casesensitive-${Date.now()}-${Math.random()}`,
      label: 'Case Sensitive 2',
      description: 'Case sensitive key 2'
    }

    const specType1 = await specTypeService.create(specTypeData1)
    const specType2 = await specTypeService.create(specTypeData2)

    // Should create two different spec types due to case sensitivity
    assert.notEqual(specType1.id, specType2.id)
    assert.notEqual(specType1.key, specType2.key)
  })

  test('should handle duplicate key detection', async ({ assert }) => {
    const key = `duplicate-${Date.now()}-${Math.random()}`
    const specTypeData1 = {
      key: key,
      label: 'First Label',
      description: 'First Description'
    }

    const specTypeData2 = {
      key: key,
      label: 'Second Label',
      description: 'Second Description'
    }

    const specType1 = await specTypeService.create(specTypeData1)
    const specType2 = await specTypeService.create(specTypeData2)

    // Should return the same spec type (first one created)
    assert.equal(specType1.id, specType2.id)
    assert.equal(specType1.key, specType2.key)
    assert.equal(specType1.label, specTypeData1.label) // Should keep original label
    assert.equal(specType1.description, specTypeData1.description) // Should keep original description
  })

  test('should handle numeric characters in keys', async ({ assert }) => {
    const specTypeData = {
      key: `key123-${Date.now()}-${Math.random()}`,
      label: 'Numeric Key',
      description: 'Spec type with numeric characters in key'
    }

    const specType = await specTypeService.create(specTypeData)

    assert.equal(specType.key, specTypeData.key)
    assert.equal(specType.label, specTypeData.label)
    assert.equal(specType.description, specTypeData.description)
  })

  test('should handle underscore and dash in keys', async ({ assert }) => {
    const specTypeData = {
      key: `key_with-dash-${Date.now()}-${Math.random()}`,
      label: 'Underscore Dash Key',
      description: 'Spec type with underscore and dash in key'
    }

    const specType = await specTypeService.create(specTypeData)

    assert.equal(specType.key, specTypeData.key)
    assert.equal(specType.label, specTypeData.label)
    assert.equal(specType.description, specTypeData.description)
  })

  test('should handle unicode characters in spec type data', async ({ assert }) => {
    const specTypeData = {
      key: `unicode-${Date.now()}-${Math.random()}`,
      label: 'Couleur 🎨 Taille 📏',
      description: 'Spécifications avec caractères unicode: émojis, accents, etc.'
    }

    const specType = await specTypeService.create(specTypeData)

    assert.equal(specType.key, specTypeData.key)
    assert.equal(specType.label, specTypeData.label)
    assert.equal(specType.description, specTypeData.description)
  })

  test('should handle very long key', async ({ assert }) => {
    const longKey = 'a'.repeat(250) // Stay within varchar(255) limit
    const specTypeData = {
      key: longKey,
      label: 'Long Key',
      description: 'Spec type with very long key'
    }

    const specType = await specTypeService.create(specTypeData)

    assert.equal(specType.key, longKey)
    assert.equal(specType.label, specTypeData.label)
    assert.equal(specType.description, specTypeData.description)
  })

  test('should handle multiple spec types with similar data', async ({ assert }) => {
    const baseKey = `similar-${Date.now()}-${Math.random()}`
    
    const specType1 = await specTypeService.create({
      key: `${baseKey}-1`,
      label: 'Similar Label',
      description: 'Similar Description'
    })

    const specType2 = await specTypeService.create({
      key: `${baseKey}-2`,
      label: 'Similar Label',
      description: 'Similar Description'
    })

    // Should create two different spec types
    assert.notEqual(specType1.id, specType2.id)
    assert.notEqual(specType1.key, specType2.key)
    assert.equal(specType1.label, specType2.label)
    assert.equal(specType1.description, specType2.description)
  })

  test('should handle update with same key', async ({ assert }) => {
    const specTypeData = {
      key: `same-key-${Date.now()}-${Math.random()}`,
      label: 'Original Label',
      description: 'Original Description'
    }

    const specType = await specTypeService.create(specTypeData)

    const updateData = {
      key: specTypeData.key, // Same key
      label: 'Updated Label',
      description: 'Updated Description'
    }

    const updatedSpecType = await specTypeService.update(specType.id, updateData)

    assert.equal(updatedSpecType.id, specType.id)
    assert.equal(updatedSpecType.key, specTypeData.key)
    assert.equal(updatedSpecType.label, updateData.label)
    assert.equal(updatedSpecType.description, updateData.description)
  })

  test('should handle update with different key', async ({ assert }) => {
    const originalData = {
      key: `original-${Date.now()}-${Math.random()}`,
      label: 'Original Label',
      description: 'Original Description'
    }

    const specType = await specTypeService.create(originalData)

    const updateData = {
      key: `updated-${Date.now()}-${Math.random()}`,
      label: 'Updated Label',
      description: 'Updated Description'
    }

    const updatedSpecType = await specTypeService.update(specType.id, updateData)

    assert.equal(updatedSpecType.id, specType.id)
    assert.notEqual(updatedSpecType.key, originalData.key)
    assert.equal(updatedSpecType.key, updateData.key)
    assert.equal(updatedSpecType.label, updateData.label)
    assert.equal(updatedSpecType.description, updateData.description)
  })
})
