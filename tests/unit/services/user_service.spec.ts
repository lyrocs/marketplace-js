import { test } from '@japa/runner'
import { UserService } from '#services/user_service'
import User from '#models/user'
import Account from '#models/account'
import { TestUtils } from '#tests/helpers/test-utils'

test.group('UserService', (group) => {
  let userService: UserService

  group.setup(async () => {
    userService = new UserService()
  })

  group.teardown(async () => {
    await TestUtils.cleanup()
  })

  test('should get all users', async ({ assert }) => {
    const user1 = await TestUtils.createUser({
      email: `user1-${Date.now()}@example.com`,
      name: 'User One'
    })

    const user2 = await TestUtils.createUser({
      email: `user2-${Date.now()}@example.com`,
      name: 'User Two'
    })

    const users = await userService.all()

    assert.isArray(users)
    assert.isTrue(users.length >= 2)
    
    // Check that our created users are in the results
    const foundUser1 = users.find(u => u.id === user1.id)
    const foundUser2 = users.find(u => u.id === user2.id)
    
    assert.isNotNull(foundUser1)
    assert.isNotNull(foundUser2)
    assert.equal(foundUser1?.email, user1.email)
    assert.equal(foundUser2?.email, user2.email)
  })

  test('should get first user', async ({ assert }) => {
    const user = await TestUtils.createUser({
      email: `first-${Date.now()}@example.com`,
      name: 'First User'
    })

    const firstUser = await userService.getFirst()

    assert.isNotNull(firstUser)
    assert.isTrue(firstUser!.id.length > 0)
  })

  test('should return null when no users exist for getFirst', async ({ assert }) => {
    // Clean up all users first
    await User.query().delete()
    
    const firstUser = await userService.getFirst()

    assert.isNull(firstUser)
  })

  test('should get user by id', async ({ assert }) => {
    const user = await TestUtils.createUser({
      email: `getbyid-${Date.now()}@example.com`,
      name: 'Get By ID User'
    })

    const foundUser = await userService.one(user.id)

    assert.equal(foundUser.id, user.id)
    assert.equal(foundUser.email, user.email)
    assert.equal(foundUser.name, user.name)
  })

  test('should throw error when getting non-existent user by id', async ({ assert }) => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000'

    await assert.rejects(
      () => userService.one(nonExistentId),
      'Row not found'
    )
  })

  test('should update user', async ({ assert }) => {
    const user = await TestUtils.createUser({
      email: `update-${Date.now()}@example.com`,
      name: 'Original Name'
    })

    const updateData = {
      name: 'Updated Name',
      image: 'https://example.com/updated-image.jpg'
    }

    const updatedUser = await userService.update(user.id, updateData)

    assert.equal(updatedUser.id, user.id)
    assert.equal(updatedUser.name, updateData.name)
    assert.equal(updatedUser.image, updateData.image)
    assert.equal(updatedUser.email, user.email) // Email should remain unchanged
  })

  test('should throw error when updating non-existent user', async ({ assert }) => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000'
    const updateData = {
      name: 'Updated Name'
    }

    await assert.rejects(
      () => userService.update(nonExistentId, updateData),
      'Row not found'
    )
  })

  test('should get account by provider account id', async ({ assert }) => {
    const user = await TestUtils.createUser({
      email: `account-${Date.now()}@example.com`,
      name: 'Account User'
    })

    const account = await Account.create({
      user_id: user.id,
      provider: 'google',
      provider_account_id: 'google-123',
      access_token: 'access-token',
      refresh_token: 'refresh-token',
      type: 'oauth',
      expires_at: Math.floor(Date.now() / 1000) + 3600, // Unix timestamp in seconds
      token_type: 'Bearer',
      scope: 'email profile',
      id_token: 'id-token'
    })

    const foundAccount = await userService.getAccount('google-123')

    assert.equal(foundAccount.provider_account_id, 'google-123')
    assert.equal(foundAccount.provider, 'google')
    assert.equal(foundAccount.user_id, user.id)
    assert.isNotNull(foundAccount.user)
    assert.equal(foundAccount.user.id, user.id)
  })

  test('should throw error when getting non-existent account', async ({ assert }) => {
    const nonExistentAccountId = 'non-existent-account'

    await assert.rejects(
      () => userService.getAccount(nonExistentAccountId),
      'Row not found'
    )
  })

  test('should create Google account with user', async ({ assert }) => {
    const userData = {
      id: 'google-user-123',
      email: `google-${Date.now()}@example.com`,
      name: 'Google User',
      image: 'https://example.com/google-avatar.jpg',
      token: {
        token: 'google-access-token',
        expires_at: Math.floor(Date.now() / 1000) + 3600, // Unix timestamp in seconds
        id_token: 'google-id-token'
      }
    }

    const matrixUser = {
      username: 'matrix-user-123',
      password: 'matrix-password-123'
    }

    const user = await userService.createGoogleAccount(userData, matrixUser)

    assert.equal(user.email, userData.email)
    assert.equal(user.name, userData.name)
    assert.equal(user.image, userData.image)
    assert.equal(user.matrixLogin, matrixUser.username)
    assert.equal(user.matrixPassword, matrixUser.password)

    // Verify account was created
    const account = await Account.query()
      .where('provider_account_id', userData.id)
      .first()

    assert.isNotNull(account)
    assert.equal(account?.provider, 'google')
    assert.equal(account?.user_id, user.id)
    assert.equal(account?.access_token, userData.token.token)
    assert.equal(account?.id_token, userData.token.id_token)
  })

  test('should create Google account without matrix user', async ({ assert }) => {
    const userData = {
      id: 'google-user-no-matrix-123',
      email: `google-no-matrix-${Date.now()}@example.com`,
      name: 'Google User No Matrix',
      image: 'https://example.com/google-avatar.jpg',
      token: {
        token: 'google-access-token',
        expires_at: Math.floor(Date.now() / 1000) + 3600, // Unix timestamp in seconds
        id_token: 'google-id-token'
      }
    }

    const user = await userService.createGoogleAccount(userData, null)

    assert.equal(user.email, userData.email)
    assert.equal(user.name, userData.name)
    assert.equal(user.image, userData.image)
    assert.isUndefined(user.matrixLogin)
    assert.isUndefined(user.matrixPassword)

    // Verify account was created
    const account = await Account.query()
      .where('provider_account_id', userData.id)
      .first()

    assert.isNotNull(account)
    assert.equal(account?.provider, 'google')
    assert.equal(account?.user_id, user.id)
  })

  test('should handle special characters in user data', async ({ assert }) => {
    const user = await TestUtils.createUser({
      email: `special-${Date.now()}@example.com`,
      name: 'User with Special Characters: @#$%^&*()_+-=[]{}|;:,.<>?'
    })

    const updateData = {
      name: 'Updated with émojis 🎨 and accents: éàèùç'
    }

    const updatedUser = await userService.update(user.id, updateData)

    assert.equal(updatedUser.name, updateData.name)
  })

  test('should handle very long user data', async ({ assert }) => {
    const longString = 'A'.repeat(200) // Stay within varchar(255) limit
    const user = await TestUtils.createUser({
      email: `long-${Date.now()}@example.com`,
      name: longString
    })

    const updateData = {
      name: longString + ' Updated'
    }

    const updatedUser = await userService.update(user.id, updateData)

    assert.equal(updatedUser.name, updateData.name)
  })

  test('should handle empty strings in user data', async ({ assert }) => {
    const user = await TestUtils.createUser({
      email: `empty-${Date.now()}@example.com`,
      name: 'Original Name'
    })

    const updateData = {
      name: '',
      image: ''
    }

    const updatedUser = await userService.update(user.id, updateData)

    assert.equal(updatedUser.name, '')
    assert.equal(updatedUser.image, '')
  })

  test('should maintain data integrity when updating user', async ({ assert }) => {
    const user = await TestUtils.createUser({
      email: `integrity-${Date.now()}@example.com`,
      name: 'Original Name',
      image: 'https://example.com/original.jpg'
    })

    const originalId = user.id
    const originalEmail = user.email

    const updateData = {
      name: 'Updated Name',
      image: 'https://example.com/updated.jpg'
    }

    const updatedUser = await userService.update(user.id, updateData)

    assert.equal(updatedUser.id, originalId)
    assert.equal(updatedUser.email, originalEmail) // Email should not change
    assert.equal(updatedUser.name, updateData.name)
    assert.equal(updatedUser.image, updateData.image)
  })

  test('should handle multiple accounts for same user', async ({ assert }) => {
    const user = await TestUtils.createUser({
      email: `multi-account-${Date.now()}@example.com`,
      name: 'Multi Account User'
    })

    // Create multiple accounts for the same user with unique provider_account_id
    const account1 = await Account.create({
      user_id: user.id,
      provider: 'google',
      provider_account_id: `google-${Date.now()}-123`,
      access_token: 'google-token',
      refresh_token: 'google-refresh',
      type: 'oauth',
      expires_at: Math.floor(Date.now() / 1000) + 3600, // Unix timestamp in seconds
      token_type: 'Bearer',
      scope: 'email',
      id_token: 'google-id'
    })

    const account2 = await Account.create({
      user_id: user.id,
      provider: 'facebook',
      provider_account_id: `facebook-${Date.now()}-456`,
      access_token: 'facebook-token',
      refresh_token: 'facebook-refresh',
      type: 'oauth',
      expires_at: Math.floor(Date.now() / 1000) + 3600, // Unix timestamp in seconds
      token_type: 'Bearer',
      scope: 'email',
      id_token: 'facebook-id'
    })

    const googleAccount = await userService.getAccount(account1.provider_account_id)
    const facebookAccount = await userService.getAccount(account2.provider_account_id)

    assert.equal(googleAccount.provider, 'google')
    assert.equal(facebookAccount.provider, 'facebook')
    assert.equal(googleAccount.user_id, user.id)
    assert.equal(facebookAccount.user_id, user.id)
  })

  test('should handle Google account with complex token data', async ({ assert }) => {
    const userData = {
      id: 'google-complex-123',
      email: `google-complex-${Date.now()}@example.com`,
      name: 'Complex Google User',
      image: 'https://example.com/complex-avatar.jpg',
      token: {
        token: 'very-long-access-token-with-special-characters-@#$%^&*()',
        expires_at: Math.floor(Date.now() / 1000) + 7200, // 2 hours in seconds
        id_token: 'complex-id-token-with-encoded-data'
      }
    }

    const matrixUser = {
      username: 'complex-matrix-user',
      password: 'complex-matrix-password-with-special-chars'
    }

    const user = await userService.createGoogleAccount(userData, matrixUser)

    assert.equal(user.email, userData.email)
    assert.equal(user.matrixLogin, matrixUser.username)
    assert.equal(user.matrixPassword, matrixUser.password)

    // Verify account was created with complex token data
    const account = await Account.query()
      .where('provider_account_id', userData.id)
      .first()

    assert.isNotNull(account)
    assert.equal(account?.access_token, userData.token.token)
    assert.equal(account?.id_token, userData.token.id_token)
    assert.equal(account?.expires_at, userData.token.expires_at)
  })

  test('should handle case-sensitive user IDs', async ({ assert }) => {
    const user = await TestUtils.createUser({
      email: `case-sensitive-${Date.now()}@example.com`,
      name: 'Case Sensitive User'
    })

    // User IDs are UUIDs, so they should be case-sensitive
    const foundUser = await userService.one(user.id)

    assert.equal(foundUser.id, user.id)
    assert.equal(foundUser.email, user.email)
  })

  test('should handle update with partial data', async ({ assert }) => {
    const user = await TestUtils.createUser({
      email: `partial-${Date.now()}@example.com`,
      name: 'Original Name',
      image: 'https://example.com/original.jpg'
    })

    // Update only name, keep image unchanged
    const updateData = {
      name: 'Updated Name Only'
    }

    const updatedUser = await userService.update(user.id, updateData)

    assert.equal(updatedUser.name, updateData.name)
    assert.equal(updatedUser.image, user.image) // Should remain unchanged
    assert.equal(updatedUser.email, user.email) // Should remain unchanged
  })

  test('should handle update with null values', async ({ assert }) => {
    const user = await TestUtils.createUser({
      email: `null-update-${Date.now()}@example.com`,
      name: 'Original Name',
      image: 'https://example.com/original.jpg'
    })

    const updateData = {
      name: null,
      image: null
    }

    const updatedUser = await userService.update(user.id, updateData)

    assert.isNull(updatedUser.name)
    assert.isNull(updatedUser.image)
    assert.equal(updatedUser.email, user.email) // Should remain unchanged
  })
})
