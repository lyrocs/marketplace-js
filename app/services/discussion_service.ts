import Discussion from '#models/discussion'
import DiscussionStatus from '#models/discussion_status'
import Message from '#models/message'

export class DiscussionService {

  async getDiscussionsByUser(userId: string) {
    const discussions = await Discussion.query()
      .where('buyer_id', userId)
      .orWhere('seller_id', userId)
      .preload('deal')
      .preload('buyer')
      .preload('seller')
      .preload('status')
      .preload('messages', (q) => q.orderBy('id', 'asc').limit(50).preload('sender'))
    return discussions
  }

  async getDiscussion(dealId: number, buyerId: string, sellerId: string) {
    const discussion = await Discussion.query()
      .where('deal_id', dealId)
      .where('buyer_id', buyerId)
      .where('seller_id', sellerId)
      .first()
    if (!discussion) {
      return null
    }
    return discussion
  }

  async createDiscussion(dealId: number, buyerId: string, sellerId: string) {
    const existingDiscussion = await Discussion.query()
      .where('deal_id', dealId)
      .where('buyer_id', buyerId)
      .where('seller_id', sellerId)
      .first()
    if (existingDiscussion) {
      return existingDiscussion
    }

    const newDiscussion = await Discussion.create({
      dealId: dealId,
      buyerId: buyerId,
      sellerId: sellerId,
    })
    return newDiscussion
  }

  async createMessage(discussionId: number, senderId: string, body: string) {
    const message = await Message.create({
      discussionId,
      senderId,
      body,
    })
    await this.setNewMessage(discussionId, senderId)
    return message
  }

  async getMessages(discussionId: number, afterId?: number) {
    const query = Message.query()
      .where('discussion_id', discussionId)
      .orderBy('id', 'asc')
      .preload('sender')
    if (afterId) {
      query.where('id', '>', afterId)
    }
    return query
  }

  // set new message bool on discussion_statuses
  async setNewMessage(discussionId: number, senderId: string) {
    const discussion = await Discussion.query()
      .where('id', discussionId)
      .first()
    if (!discussion) {
      return null
    }
    const target = senderId === discussion.buyerId ? discussion.sellerId : discussion.buyerId
    const discussionStatus = await DiscussionStatus.query()
      .where('discussion_id', discussion.id)
      .where('user_id', target)
      .first()
    if (!discussionStatus) {
      const newDiscussionStatus = await DiscussionStatus.create({
        discussionId: discussion.id,
        userId: target,
        newMessage: true,
      })
      return newDiscussionStatus
    }
    discussionStatus.newMessage = true
    await discussionStatus.save()
    return discussionStatus
  }

  async countNewMessages(userId: string): Promise<number> {
    const discussionStatus = await DiscussionStatus.query()
      .where('user_id', userId)
      .where('new_message', true)
      .count('*', 'total')
    return Number(discussionStatus[0]?.$extras.total) || 0
  }

  async markAsRead(userId: string, discussionId: number) {
    const discussionStatus = await DiscussionStatus.query()
      .where('user_id', userId)
      .where('discussion_id', discussionId)
      .where('new_message', true)
      .first()
    if (!discussionStatus) {
      return null
    }
    discussionStatus.newMessage = false
    await discussionStatus.save()
    return discussionStatus
  }
}
