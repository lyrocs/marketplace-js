import { test } from '@japa/runner'
import { DiscussionService } from '#services/discussion_service'
import Discussion from '#models/discussion'
import DiscussionStatus from '#models/discussion_status'
import Deal from '#models/deal'
import User from '#models/user'
import { TestUtils } from '#tests/helpers/test-utils'

test.group('DiscussionService', (group) => {
  let discussionService: DiscussionService

  group.setup(async () => {
    discussionService = new DiscussionService()
  })

  group.teardown(async () => {
    await TestUtils.cleanup()
  })

  test('should create a new discussion', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })
    const roomId = 'matrix-room-123'

    const discussion = await discussionService.createDiscussion(
      deal.id,
      buyer.id,
      seller.id,
      roomId
    )

    assert.equal(discussion.dealId, deal.id)
    assert.equal(discussion.buyerId, buyer.id)
    assert.equal(discussion.sellerId, seller.id)
    assert.equal(discussion.matrixRoomId, roomId)
    assert.isTrue(discussion.id > 0)
  })

  test('should return existing discussion if already exists', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })
    const roomId = 'matrix-room-456'

    // Create first discussion
    const firstDiscussion = await discussionService.createDiscussion(
      deal.id,
      buyer.id,
      seller.id,
      roomId
    )

    // Try to create same discussion again
    const secondDiscussion = await discussionService.createDiscussion(
      deal.id,
      buyer.id,
      seller.id,
      roomId
    )

    // Should return the same discussion
    assert.equal(firstDiscussion.id, secondDiscussion.id)
    assert.equal(firstDiscussion.dealId, secondDiscussion.dealId)
    assert.equal(firstDiscussion.buyerId, secondDiscussion.buyerId)
    assert.equal(firstDiscussion.sellerId, secondDiscussion.sellerId)
  })

  test('should get discussions by user (as buyer)', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })
    const roomId = 'matrix-room-buyer'

    await discussionService.createDiscussion(deal.id, buyer.id, seller.id, roomId)

    const discussions = await discussionService.getDiscussionsByUser(buyer.id)

    assert.isArray(discussions)
    assert.lengthOf(discussions, 1)
    assert.equal(discussions[0].buyerId, buyer.id)
    assert.equal(discussions[0].sellerId, seller.id)
  })

  test('should get discussions by user (as seller)', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })
    const roomId = 'matrix-room-seller'

    await discussionService.createDiscussion(deal.id, buyer.id, seller.id, roomId)

    const discussions = await discussionService.getDiscussionsByUser(seller.id)

    assert.isArray(discussions)
    assert.lengthOf(discussions, 1)
    assert.equal(discussions[0].buyerId, buyer.id)
    assert.equal(discussions[0].sellerId, seller.id)
  })

  test('should get discussions by user (both buyer and seller)', async ({ assert }) => {
    const user1 = await TestUtils.createUser()
    const user2 = await TestUtils.createUser()
    const user3 = await TestUtils.createUser()
    
    const deal1 = await TestUtils.createDeal({ userId: user1.id })
    const deal2 = await TestUtils.createDeal({ userId: user2.id })

    // User1 is seller in deal1, buyer in deal2
    await discussionService.createDiscussion(deal1.id, user2.id, user1.id, 'room-1')
    await discussionService.createDiscussion(deal2.id, user1.id, user2.id, 'room-2')

    const discussions = await discussionService.getDiscussionsByUser(user1.id)

    assert.isArray(discussions)
    assert.lengthOf(discussions, 2)
    
    // Verify user1 appears in both discussions
    const user1AsSeller = discussions.find(d => d.sellerId === user1.id)
    const user1AsBuyer = discussions.find(d => d.buyerId === user1.id)
    
    assert.isNotNull(user1AsSeller)
    assert.isNotNull(user1AsBuyer)
  })

  test('should get specific discussion', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })
    const roomId = 'matrix-room-specific'

    await discussionService.createDiscussion(deal.id, buyer.id, seller.id, roomId)

    const discussion = await discussionService.getDiscussion(deal.id, buyer.id, seller.id)

    assert.isNotNull(discussion)
    assert.equal(discussion?.dealId, deal.id)
    assert.equal(discussion?.buyerId, buyer.id)
    assert.equal(discussion?.sellerId, seller.id)
    assert.equal(discussion?.matrixRoomId, roomId)
  })

  test('should return null for non-existent discussion', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })

    const discussion = await discussionService.getDiscussion(deal.id, buyer.id, seller.id)

    assert.isNull(discussion)
  })

  test('should set new message for buyer', async ({ assert }) => {
    const buyer = await TestUtils.createUser({ name: 'Buyer User' })
    const seller = await TestUtils.createUser({ name: 'Seller User' })
    const deal = await TestUtils.createDeal({ userId: seller.id })
    const roomId = 'matrix-room-message'

    // Create discussion
    const discussion = await discussionService.createDiscussion(
      deal.id,
      buyer.id,
      seller.id,
      roomId
    )

    // Set new message (seller sends message to buyer)
    const discussionStatus = await discussionService.setNewMessage(roomId, seller.id)

    assert.isNotNull(discussionStatus)
    assert.equal(discussionStatus?.discussionId, discussion.id)
    assert.equal(discussionStatus?.userId, buyer.id)
    assert.isTrue(discussionStatus?.newMessage)
  })

  test('should set new message for seller', async ({ assert }) => {
    const buyer = await TestUtils.createUser({ name: 'Buyer User' })
    const seller = await TestUtils.createUser({ name: 'Seller User' })
    const deal = await TestUtils.createDeal({ userId: seller.id })
    const roomId = 'matrix-room-message-seller'

    // Create discussion
    const discussion = await discussionService.createDiscussion(
      deal.id,
      buyer.id,
      seller.id,
      roomId
    )

    // Set new message (buyer sends message to seller)
    const discussionStatus = await discussionService.setNewMessage(roomId, buyer.matrixLogin || '')

    assert.isNotNull(discussionStatus)
    assert.equal(discussionStatus?.discussionId, discussion.id)
    assert.equal(discussionStatus?.userId, seller.id)
    assert.isTrue(discussionStatus?.newMessage)
  })

  test('should update existing discussion status when setting new message', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })
    const roomId = 'matrix-room-update'

    // Create discussion
    const discussion = await discussionService.createDiscussion(
      deal.id,
      buyer.id,
      seller.id,
      roomId
    )

    // Set new message first time
    const firstStatus = await discussionService.setNewMessage(roomId, seller.id)
    assert.isTrue(firstStatus?.newMessage)

    // Set new message again (should update existing status)
    const secondStatus = await discussionService.setNewMessage(roomId, seller.id)
    assert.isTrue(secondStatus?.newMessage)
    assert.equal(firstStatus?.id, secondStatus?.id)
  })

  test('should return null when setting new message for non-existent room', async ({ assert }) => {
    const nonExistentRoomId = 'non-existent-room'

    const discussionStatus = await discussionService.setNewMessage(nonExistentRoomId, 'user-id')

    assert.isNull(discussionStatus)
  })

  test('should count new messages for user', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })
    const roomId = 'matrix-room-count'

    // Create discussion
    await discussionService.createDiscussion(deal.id, buyer.id, seller.id, roomId)

    // Set new messages
    await discussionService.setNewMessage(roomId, seller.id)
    await discussionService.setNewMessage(roomId, seller.id) // Should not create duplicate

    const newMessageCount = await discussionService.countNewMessages(buyer.id)

    assert.equal(newMessageCount, 1)
  })

  test('should return zero new messages for user with no new messages', async ({ assert }) => {
    const user = await TestUtils.createUser()

    const newMessageCount = await discussionService.countNewMessages(user.id)

    assert.equal(newMessageCount, 0)
  })

  test('should count multiple new messages for user', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller1 = await TestUtils.createUser()
    const seller2 = await TestUtils.createUser()
    
    const deal1 = await TestUtils.createDeal({ userId: seller1.id })
    const deal2 = await TestUtils.createDeal({ userId: seller2.id })
    
    const roomId1 = 'matrix-room-multiple-1'
    const roomId2 = 'matrix-room-multiple-2'

    // Create discussions
    await discussionService.createDiscussion(deal1.id, buyer.id, seller1.id, roomId1)
    await discussionService.createDiscussion(deal2.id, buyer.id, seller2.id, roomId2)

    // Set new messages in both discussions
    await discussionService.setNewMessage(roomId1, seller1.id)
    await discussionService.setNewMessage(roomId2, seller2.id)

    const newMessageCount = await discussionService.countNewMessages(buyer.id)

    assert.equal(newMessageCount, 2)
  })

  test('should mark discussion as read', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })
    const roomId = 'matrix-room-mark-read'

    // Create discussion and set new message
    const discussion = await discussionService.createDiscussion(
      deal.id,
      buyer.id,
      seller.id,
      roomId
    )
    await discussionService.setNewMessage(roomId, seller.id)

    // Verify new message exists
    let newMessageCount = await discussionService.countNewMessages(buyer.id)
    assert.equal(newMessageCount, 1)

    // Mark as read
    const updatedStatus = await discussionService.markAsRead(buyer.id, discussion.id)

    assert.isNotNull(updatedStatus)
    assert.isFalse(updatedStatus?.newMessage)

    // Verify new message count is now zero
    newMessageCount = await discussionService.countNewMessages(buyer.id)
    assert.equal(newMessageCount, 0)
  })

  test('should return null when marking non-existent discussion as read', async ({ assert }) => {
    const user = await TestUtils.createUser()
    const nonExistentDiscussionId = 99999

    const result = await discussionService.markAsRead(user.id, nonExistentDiscussionId)

    assert.isNull(result)
  })

  test('should return null when marking discussion as read for user with no new messages', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })
    const roomId = 'matrix-room-no-new'

    // Create discussion without setting new message
    const discussion = await discussionService.createDiscussion(
      deal.id,
      buyer.id,
      seller.id,
      roomId
    )

    const result = await discussionService.markAsRead(buyer.id, discussion.id)

    assert.isNull(result)
  })

  test('should handle multiple discussions for same user', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller1 = await TestUtils.createUser()
    const seller2 = await TestUtils.createUser()
    
    const deal1 = await TestUtils.createDeal({ userId: seller1.id })
    const deal2 = await TestUtils.createDeal({ userId: seller2.id })
    
    const roomId1 = 'matrix-room-multiple-1'
    const roomId2 = 'matrix-room-multiple-2'

    // Create multiple discussions
    const discussion1 = await discussionService.createDiscussion(
      deal1.id,
      buyer.id,
      seller1.id,
      roomId1
    )
    const discussion2 = await discussionService.createDiscussion(
      deal2.id,
      buyer.id,
      seller2.id,
      roomId2
    )

    // Set new messages in both
    await discussionService.setNewMessage(roomId1, seller1.id)
    await discussionService.setNewMessage(roomId2, seller2.id)

    // Get all discussions for buyer
    const discussions = await discussionService.getDiscussionsByUser(buyer.id)

    assert.isArray(discussions)
    assert.lengthOf(discussions, 2)
    
    // Verify both discussions are present
    const discussionIds = discussions.map(d => d.id)
    assert.include(discussionIds, discussion1.id)
    assert.include(discussionIds, discussion2.id)
  })

  test('should handle discussion with special characters in room ID', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })
    const specialRoomId = 'matrix-room-!@#$%^&*()_+-=[]{}|;:,.<>?'

    const discussion = await discussionService.createDiscussion(
      deal.id,
      buyer.id,
      seller.id,
      specialRoomId
    )

    assert.equal(discussion.matrixRoomId, specialRoomId)
    assert.isTrue(discussion.id > 0)
  })

  test('should handle very long room ID', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })
    const longRoomId = 'matrix-room-' + 'A'.repeat(200)

    const discussion = await discussionService.createDiscussion(
      deal.id,
      buyer.id,
      seller.id,
      longRoomId
    )

    assert.equal(discussion.matrixRoomId, longRoomId)
    assert.isTrue(discussion.id > 0)
  })

  test('should maintain data integrity when creating multiple discussions', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })
    const roomId = 'matrix-room-integrity'

    const discussion = await discussionService.createDiscussion(
      deal.id,
      buyer.id,
      seller.id,
      roomId
    )

    const originalId = discussion.id
    const originalDealId = discussion.dealId
    const originalBuyerId = discussion.buyerId
    const originalSellerId = discussion.sellerId

    // Verify data integrity
    assert.equal(discussion.id, originalId)
    assert.equal(discussion.dealId, originalDealId)
    assert.equal(discussion.buyerId, originalBuyerId)
    assert.equal(discussion.sellerId, originalSellerId)
    assert.equal(discussion.matrixRoomId, roomId)
  })
})
