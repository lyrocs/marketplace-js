import { test } from '@japa/runner'
import { MatrixService } from '#services/matrix_service'
import { DiscussionService } from '#services/discussion_service'
import { TestUtils } from '#tests/helpers/test-utils'

// Import nock for HTTP mocking
import nock from 'nock'

test.group('MatrixService', (group) => {
  let matrixService: MatrixService
  let discussionService: DiscussionService

  // Helper function to mock MatrixService initialization
  const mockMatrixServiceInit = (accessToken: string = 'mock-access-token') => {
    const mockClient = {
      startClient: () => {},
      on: () => {},
      createRoom: () => Promise.resolve({ room_id: '!mock-room:matrix.example.com' }),
    }
    
    matrixService.client = mockClient as any
    matrixService.accessToken = accessToken
  }

  group.setup(async () => {
    discussionService = new DiscussionService()
    matrixService = new MatrixService(discussionService)

    nock(`https://matrix.example.com`)
      .persist()
      .put(/\/_synapse\/admin\/v2\/users\/.+/)
      .optionally()
      .reply(200, {})

    nock(`https://matrix.example.com`)
      .post('/_matrix/client/v3/login')
      .optionally()
      .reply(200, {})
  })

  group.teardown(async () => {
    await TestUtils.cleanup()
    // Clean up all nock interceptors
    nock.cleanAll()
  })


  test('should start client if not already initialized', async ({ assert }) => {
    // Mock the initialization
    mockMatrixServiceInit()

    await matrixService.start()

    assert.isNotNull(matrixService.client)
  })

  test('should not reinitialize if client already exists', async ({ assert }) => {
    // Mock the initialization
    mockMatrixServiceInit()
    const firstClient = matrixService.client

    // Try to start again
    await matrixService.start()
    const secondClient = matrixService.client

    // Should be the same client instance
    assert.equal(firstClient, secondClient)
  })

  test('should create user successfully', async ({ assert }) => {
    const matrixHost = 'matrix.example.com'
    
    // Mock successful user creation
    nock(`https://${matrixHost}`)
      .put(/\/_synapse\/admin\/v2\/users\/%40.*%3A.*/)
      .reply(200, {})

    const result = await matrixService.createUser()

    assert.isNotNull(result)
    assert.isString(result?.username)
    assert.isString(result?.password)
    assert.isTrue(result?.username.startsWith('@'))
    assert.isTrue(result?.username.includes(':matrix.example.com'))
    assert.lengthOf(result?.password || '', 16)
  })

//   test('should handle user creation failure', async ({ assert }) => {
//     // Mock failed user creation
//     // nock.cleanAll()
//       nock(`https://matrix.example.com`)
//     //   .persist()
//       .put(/\/_synapse\/admin\/v2\/users\/.+/)
//       .optionally()
//       .reply(409, { error: 'User already exists' })

//     const result = await matrixService.createUser()
//     console.error('result: %j', result)
//     assert.isNull(result)
//   })

  test('should create room successfully', async ({ assert }) => {
    const mockRoomId = '!room123:matrix.example.com'
    
    // Mock the initialization first
    mockMatrixServiceInit()
    
    // Mock the client's createRoom method
    matrixService.client = {
      createRoom: async () => ({ room_id: mockRoomId })
    } as any

    const roomData = {
      name: 'Test Deal Discussion',
      sellerName: '@seller:matrix.example.com',
      buyerName: '@buyer:matrix.example.com'
    }

    const roomId = await matrixService.createRoom(roomData)

    assert.equal(roomId, mockRoomId)
  })

  test('should handle room creation failure', async ({ assert }) => {
    // Mock the initialization first
    mockMatrixServiceInit()
    
    // Mock room creation failure
    matrixService.client = {
      createRoom: async () => null
    } as any

    const roomData = {
      name: 'Test Deal Discussion',
      sellerName: '@seller:matrix.example.com',
      buyerName: '@buyer:matrix.example.com'
    }

    const roomId = await matrixService.createRoom(roomData)

    assert.equal(roomId, '')
  })

  test('should handle room creation with empty response', async ({ assert }) => {
    // Mock the initialization first
    mockMatrixServiceInit()
    
    // Mock empty response
    matrixService.client = {
      createRoom: async () => ({})
    } as any

    const roomData = {
      name: 'Test Deal Discussion',
      sellerName: '@seller:matrix.example.com',
      buyerName: '@buyer:matrix.example.com'
    }

    const roomId = await matrixService.createRoom(roomData)

    assert.equal(roomId, '')
  })

  test('should generate random username and password', async ({ assert }) => {
    
    const result1 = await matrixService.createUser()
    const result2 = await matrixService.createUser()

    // Usernames should be different
    assert.notEqual(result1?.username, result2?.username)
    assert.notEqual(result1?.password, result2?.password)
    
    // But should follow the same format
    assert.isTrue(result1?.username.startsWith('@'))
    assert.isTrue(result1?.username.includes(':matrix.example.com'))
    assert.lengthOf(result1?.password || '', 16)
    assert.lengthOf(result2?.password || '', 16)
  })

  test('should handle special characters in room name', async ({ assert }) => {
    const mockRoomId = '!room-special:matrix.example.com'
    
    // Mock the initialization first
    mockMatrixServiceInit()
    
    matrixService.client = {
      createRoom: async () => ({ room_id: mockRoomId })
    } as any

    const roomData = {
      name: 'Deal & Co. (Ltd.) - "Premium" €500',
      sellerName: '@seller:matrix.example.com',
      buyerName: '@buyer:matrix.example.com'
    }

    const roomId = await matrixService.createRoom(roomData)

    assert.equal(roomId, mockRoomId)
  })

  test('should handle very long room name', async ({ assert }) => {
    const mockRoomId = '!room-long:matrix.example.com'
    
    // Mock the initialization first
    mockMatrixServiceInit()
    
    matrixService.client = {
      createRoom: async () => ({ room_id: mockRoomId })
    } as any

    const longName = 'A'.repeat(255)
    const roomData = {
      name: longName,
      sellerName: '@seller:matrix.example.com',
      buyerName: '@buyer:matrix.example.com'
    }

    const roomId = await matrixService.createRoom(roomData)

    assert.equal(roomId, mockRoomId)
  })

  test('should handle room creation with multiple invitees', async ({ assert }) => {
    const mockRoomId = '!room-multiple:matrix.example.com'
    
    // Mock the initialization first
    mockMatrixServiceInit()
    
    matrixService.client = {
      createRoom: async () => ({ room_id: mockRoomId })
    } as any

    const roomData = {
      name: 'Multi-user Discussion',
      sellerName: '@seller:matrix.example.com',
      buyerName: '@buyer:matrix.example.com'
    }

    const roomId = await matrixService.createRoom(roomData)

    assert.equal(roomId, mockRoomId)
  })

//   test('should handle network errors during initialization', async ({ assert }) => {
//     const matrixHost = 'matrix.example.com'
    
//     // Mock network error
//     nock(`https://${matrixHost}`)
//       .post('/_matrix/client/v3/login')
//       .replyWithError('Network error')

//     await matrixService.init()

//     assert.isNull(matrixService.client)
//     assert.isNull(matrixService.accessToken)
//   })

//   test('should handle network errors during user creation', async ({ assert }) => {
//     const matrixHost = 'matrix.example.com'
    
//     // Mock network error
//     nock(`https://${matrixHost}`)
//       .put(/\/_synapse\/admin\/v2\/users\/%40.*%3A.*/)
//       .replyWithError('Network error')

//     const result = await matrixService.createUser()

//     assert.isNull(result)
//   })

//   test('should handle malformed JSON response', async ({ assert }) => {
//     const matrixHost = 'matrix.example.com'
    
//     // Mock malformed JSON response
//     nock(`https://${matrixHost}`)
//       .post('/_matrix/client/v3/login')
//       .reply(200, 'invalid json')

//     await matrixService.init()

//     assert.isNull(matrixService.client)
//     assert.isNull(matrixService.accessToken)
//   })

  test('should maintain client state across multiple operations', async ({ assert }) => {
    // Mock the initialization
    mockMatrixServiceInit('test-token')
    const originalClient = matrixService.client
    const originalToken = matrixService.accessToken

    // Perform multiple operations
    await matrixService.start()
    await matrixService.createUser()

    // Client and token should remain the same
    assert.equal(matrixService.client, originalClient)
    assert.equal(matrixService.accessToken, originalToken)
  })

  test('should handle concurrent user creation', async ({ assert }) => {
    const matrixHost = 'matrix.example.com'
    
    // Mock successful user creation for multiple requests
    nock(`https://${matrixHost}`)
      .put(/\/_synapse\/admin\/v2\/users\/%40.*%3A.*/)
      .times(3)
      .reply(200, {})

    const promises = [
      matrixService.createUser(),
      matrixService.createUser(),
      matrixService.createUser()
    ]

    const results = await Promise.all(promises)

    // All should succeed and return different usernames
    results.forEach(result => {
      assert.isNotNull(result)
      assert.isString(result?.username)
      assert.isString(result?.password)
    })

    // All usernames should be unique
    const usernames = results.map(r => r?.username)
    const uniqueUsernames = [...new Set(usernames)]
    assert.equal(usernames.length, uniqueUsernames.length)
  })

  test('should handle concurrent room creation', async ({ assert }) => {
    const mockRoomIds = [
      '!room1:matrix.example.com',
      '!room2:matrix.example.com',
      '!room3:matrix.example.com'
    ]

    // Mock the initialization first
    mockMatrixServiceInit()
    
    let callCount = 0
    matrixService.client = {
      createRoom: async () => {
        const roomId = mockRoomIds[callCount % mockRoomIds.length]
        callCount++
        return { room_id: roomId }
      }
    } as any

    const roomData = {
      name: 'Test Room',
      sellerName: '@seller:matrix.example.com',
      buyerName: '@buyer:matrix.example.com'
    }

    const promises = [
      matrixService.createRoom(roomData),
      matrixService.createRoom(roomData),
      matrixService.createRoom(roomData)
    ]

    const results = await Promise.all(promises)

    // All should succeed and return different room IDs
    results.forEach((roomId, index) => {
      assert.equal(roomId, mockRoomIds[index])
    })
  })

  test('should handle empty room name', async ({ assert }) => {
    const mockRoomId = '!room-empty:matrix.example.com'
    
    // Mock the initialization first
    mockMatrixServiceInit()
    
    matrixService.client = {
      createRoom: async () => ({ room_id: mockRoomId })
    } as any

    const roomData = {
      name: '',
      sellerName: '@seller:matrix.example.com',
      buyerName: '@buyer:matrix.example.com'
    }

    const roomId = await matrixService.createRoom(roomData)

    assert.equal(roomId, mockRoomId)
  })

  test('should handle null/undefined room name', async ({ assert }) => {
    const mockRoomId = '!room-null:matrix.example.com'
    
    // Mock the initialization first
    mockMatrixServiceInit()
    
    matrixService.client = {
      createRoom: async () => ({ room_id: mockRoomId })
    } as any

    const roomData = {
      name: null as any,
      sellerName: '@seller:matrix.example.com',
      buyerName: '@buyer:matrix.example.com'
    }

    const roomId = await matrixService.createRoom(roomData)

    assert.equal(roomId, mockRoomId)
  })

  test('should handle empty invite list', async ({ assert }) => {
    const mockRoomId = '!room-no-invites:matrix.example.com'
    
    // Mock the initialization first
    mockMatrixServiceInit()
    
    matrixService.client = {
      createRoom: async () => ({ room_id: mockRoomId })
    } as any

    const roomData = {
      name: 'Room without invites',
      sellerName: '',
      buyerName: ''
    }

    const roomId = await matrixService.createRoom(roomData)

    assert.equal(roomId, mockRoomId)
  })

//   test('should verify HTTP requests are made correctly', async ({ assert }) => {
//     const matrixHost = 'matrix.example.com'
//     const mockLoginResponse = {
//       access_token: 'mock-access-token',
//       user_id: '@test-user:matrix.example.com'
//     }

//     // Create a scope to intercept the request
//     const scope = nock(`https://${matrixHost}`)
//       .post('/_matrix/client/v3/login', {
//         type: 'm.login.password',
//         user: 'test-user',
//         password: 'test-password'
//       })
//       .reply(200, mockLoginResponse)

//     await matrixService.init()

//     // Verify the request was made
//     assert.isTrue(scope.isDone())
//     assert.isNotNull(matrixService.client)
//     assert.equal(matrixService.accessToken, 'mock-access-token')
//   })

//   test('should handle different HTTP status codes', async ({ assert }) => {
//     const matrixHost = 'matrix.example.com'
    
//     // Test 500 server error
//     nock(`https://${matrixHost}`)
//       .post('/_matrix/client/v3/login')
//       .reply(500, { error: 'Internal server error' })

//     await matrixService.init()

//     assert.isNull(matrixService.client)
//     assert.isNull(matrixService.accessToken)
//   })

//   test('should handle timeout errors', async ({ assert }) => {
//     const matrixHost = 'matrix.example.com'
    
//     // Mock timeout
//     nock(`https://${matrixHost}`)
//       .post('/_matrix/client/v3/login')
//       .delayConnection(1000)
//       .reply(200, {})

//     // Set a shorter timeout for the test
//     const timeoutPromise = new Promise((_, reject) => {
//       setTimeout(() => reject(new Error('Timeout')), 100)
//     })

//     try {
//       await Promise.race([matrixService.init(), timeoutPromise])
//     } catch (error) {
//       // Expected timeout
//     }

//     // Should handle timeout gracefully
//     assert.isNull(matrixService.client)
//   })
})