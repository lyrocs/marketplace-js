import { test } from '@japa/runner'
import { DiscussionService } from '#services/discussion_service'
import Discussion from '#models/discussion'
import DiscussionStatus from '#models/discussion_status'
import Message from '#models/message'
import { TestUtils } from '#tests/helpers/test-utils'

test.group('DiscussionService', (group) => {
  let discussionService: DiscussionService

  group.setup(async () => {
    discussionService = new DiscussionService()
  })

  group.teardown(async () => {
    await Message.query().delete()
    await DiscussionStatus.query().delete()
    await Discussion.query().delete()
    await TestUtils.cleanup()
  })

  test('should create a new discussion', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })

    const discussion = await discussionService.createDiscussion(deal.id, buyer.id, seller.id)

    assert.equal(discussion.dealId, deal.id)
    assert.equal(discussion.buyerId, buyer.id)
    assert.equal(discussion.sellerId, seller.id)
    assert.isTrue(discussion.id > 0)
  })

  test('should return existing discussion if already exists', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })

    const firstDiscussion = await discussionService.createDiscussion(deal.id, buyer.id, seller.id)
    const secondDiscussion = await discussionService.createDiscussion(deal.id, buyer.id, seller.id)

    assert.equal(firstDiscussion.id, secondDiscussion.id)
    assert.equal(firstDiscussion.dealId, secondDiscussion.dealId)
    assert.equal(firstDiscussion.buyerId, secondDiscussion.buyerId)
    assert.equal(firstDiscussion.sellerId, secondDiscussion.sellerId)
  })

  test('should get discussions by user (as buyer)', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })

    await discussionService.createDiscussion(deal.id, buyer.id, seller.id)

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

    await discussionService.createDiscussion(deal.id, buyer.id, seller.id)

    const discussions = await discussionService.getDiscussionsByUser(seller.id)

    assert.isArray(discussions)
    assert.lengthOf(discussions, 1)
    assert.equal(discussions[0].buyerId, buyer.id)
    assert.equal(discussions[0].sellerId, seller.id)
  })

  test('should get discussions by user (both buyer and seller)', async ({ assert }) => {
    const user1 = await TestUtils.createUser()
    const user2 = await TestUtils.createUser()

    const deal1 = await TestUtils.createDeal({ userId: user1.id })
    const deal2 = await TestUtils.createDeal({ userId: user2.id })

    await discussionService.createDiscussion(deal1.id, user2.id, user1.id)
    await discussionService.createDiscussion(deal2.id, user1.id, user2.id)

    const discussions = await discussionService.getDiscussionsByUser(user1.id)

    assert.isArray(discussions)
    assert.lengthOf(discussions, 2)

    const user1AsSeller = discussions.find(d => d.sellerId === user1.id)
    const user1AsBuyer = discussions.find(d => d.buyerId === user1.id)

    assert.isNotNull(user1AsSeller)
    assert.isNotNull(user1AsBuyer)
  })

  test('should get specific discussion', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })

    await discussionService.createDiscussion(deal.id, buyer.id, seller.id)

    const discussion = await discussionService.getDiscussion(deal.id, buyer.id, seller.id)

    assert.isNotNull(discussion)
    assert.equal(discussion?.dealId, deal.id)
    assert.equal(discussion?.buyerId, buyer.id)
    assert.equal(discussion?.sellerId, seller.id)
  })

  test('should return null for non-existent discussion', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })

    const discussion = await discussionService.getDiscussion(deal.id, buyer.id, seller.id)

    assert.isNull(discussion)
  })

  test('should create a message', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })
    const discussion = await discussionService.createDiscussion(deal.id, buyer.id, seller.id)

    const message = await discussionService.createMessage(discussion.id, buyer.id, 'Hello!')

    assert.equal(message.discussionId, discussion.id)
    assert.equal(message.senderId, buyer.id)
    assert.equal(message.body, 'Hello!')
    assert.isTrue(message.id > 0)
  })

  test('should get messages for a discussion', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })
    const discussion = await discussionService.createDiscussion(deal.id, buyer.id, seller.id)

    await discussionService.createMessage(discussion.id, buyer.id, 'Hello!')
    await discussionService.createMessage(discussion.id, seller.id, 'Hi there!')

    const messages = await discussionService.getMessages(discussion.id)

    assert.isArray(messages)
    assert.lengthOf(messages, 2)
  })

  test('should get messages after a given id', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })
    const discussion = await discussionService.createDiscussion(deal.id, buyer.id, seller.id)

    const msg1 = await discussionService.createMessage(discussion.id, buyer.id, 'First')
    await discussionService.createMessage(discussion.id, seller.id, 'Second')

    const messages = await discussionService.getMessages(discussion.id, msg1.id)

    assert.isArray(messages)
    assert.lengthOf(messages, 1)
    assert.equal(messages[0].body, 'Second')
  })

  test('should set new message for buyer when seller sends', async ({ assert }) => {
    const buyer = await TestUtils.createUser({ name: 'Buyer User' })
    const seller = await TestUtils.createUser({ name: 'Seller User' })
    const deal = await TestUtils.createDeal({ userId: seller.id })

    const discussion = await discussionService.createDiscussion(deal.id, buyer.id, seller.id)

    const discussionStatus = await discussionService.setNewMessage(discussion.id, seller.id)

    assert.isNotNull(discussionStatus)
    assert.equal(discussionStatus?.discussionId, discussion.id)
    assert.equal(discussionStatus?.userId, buyer.id)
    assert.isTrue(discussionStatus?.newMessage)
  })

  test('should set new message for seller when buyer sends', async ({ assert }) => {
    const buyer = await TestUtils.createUser({ name: 'Buyer User' })
    const seller = await TestUtils.createUser({ name: 'Seller User' })
    const deal = await TestUtils.createDeal({ userId: seller.id })

    const discussion = await discussionService.createDiscussion(deal.id, buyer.id, seller.id)

    const discussionStatus = await discussionService.setNewMessage(discussion.id, buyer.id)

    assert.isNotNull(discussionStatus)
    assert.equal(discussionStatus?.discussionId, discussion.id)
    assert.equal(discussionStatus?.userId, seller.id)
    assert.isTrue(discussionStatus?.newMessage)
  })

  test('should update existing discussion status when setting new message', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })

    const discussion = await discussionService.createDiscussion(deal.id, buyer.id, seller.id)

    const firstStatus = await discussionService.setNewMessage(discussion.id, seller.id)
    assert.isTrue(firstStatus?.newMessage)

    const secondStatus = await discussionService.setNewMessage(discussion.id, seller.id)
    assert.isTrue(secondStatus?.newMessage)
    assert.equal(firstStatus?.id, secondStatus?.id)
  })

  test('should return null when setting new message for non-existent discussion', async ({ assert }) => {
    const discussionStatus = await discussionService.setNewMessage(99999, 'user-id')

    assert.isNull(discussionStatus)
  })

  test('should count new messages for user', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })

    const discussion = await discussionService.createDiscussion(deal.id, buyer.id, seller.id)

    await discussionService.setNewMessage(discussion.id, seller.id)
    await discussionService.setNewMessage(discussion.id, seller.id) // Should not create duplicate

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

    const discussion1 = await discussionService.createDiscussion(deal1.id, buyer.id, seller1.id)
    const discussion2 = await discussionService.createDiscussion(deal2.id, buyer.id, seller2.id)

    await discussionService.setNewMessage(discussion1.id, seller1.id)
    await discussionService.setNewMessage(discussion2.id, seller2.id)

    const newMessageCount = await discussionService.countNewMessages(buyer.id)

    assert.equal(newMessageCount, 2)
  })

  test('should mark discussion as read', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })

    const discussion = await discussionService.createDiscussion(deal.id, buyer.id, seller.id)
    await discussionService.setNewMessage(discussion.id, seller.id)

    let newMessageCount = await discussionService.countNewMessages(buyer.id)
    assert.equal(newMessageCount, 1)

    const updatedStatus = await discussionService.markAsRead(buyer.id, discussion.id)

    assert.isNotNull(updatedStatus)
    assert.isFalse(updatedStatus?.newMessage)

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

    const discussion = await discussionService.createDiscussion(deal.id, buyer.id, seller.id)

    const result = await discussionService.markAsRead(buyer.id, discussion.id)

    assert.isNull(result)
  })

  test('should handle multiple discussions for same user', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller1 = await TestUtils.createUser()
    const seller2 = await TestUtils.createUser()

    const deal1 = await TestUtils.createDeal({ userId: seller1.id })
    const deal2 = await TestUtils.createDeal({ userId: seller2.id })

    const discussion1 = await discussionService.createDiscussion(deal1.id, buyer.id, seller1.id)
    const discussion2 = await discussionService.createDiscussion(deal2.id, buyer.id, seller2.id)

    await discussionService.setNewMessage(discussion1.id, seller1.id)
    await discussionService.setNewMessage(discussion2.id, seller2.id)

    const discussions = await discussionService.getDiscussionsByUser(buyer.id)

    assert.isArray(discussions)
    assert.lengthOf(discussions, 2)

    const discussionIds = discussions.map(d => d.id)
    assert.include(discussionIds, discussion1.id)
    assert.include(discussionIds, discussion2.id)
  })

  test('should maintain data integrity when creating discussion', async ({ assert }) => {
    const buyer = await TestUtils.createUser()
    const seller = await TestUtils.createUser()
    const deal = await TestUtils.createDeal({ userId: seller.id })

    const discussion = await discussionService.createDiscussion(deal.id, buyer.id, seller.id)

    assert.equal(discussion.id, discussion.id)
    assert.equal(discussion.dealId, deal.id)
    assert.equal(discussion.buyerId, buyer.id)
    assert.equal(discussion.sellerId, seller.id)
  })
})
