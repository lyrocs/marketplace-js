import Discussion from '#models/discussion'
import DiscussionStatus from '#models/discussion_status'

export class DiscussionService {

  async getDiscussionsByUser(userId: string) {
    const discussions = await Discussion.query()
      .where('buyer_id', userId)
      .orWhere('seller_id', userId)
      .preload('deal')
      .preload('buyer')
      .preload('seller')
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
  async createDiscussion(dealId: number, buyerId: string, sellerId: string, roomId: string) {
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
      matrixRoomId: roomId,
    })
    return newDiscussion
  }

  // set new message bool on discussion_statuses
  async setNewMessage(roomId: string, sender: string) {
    const discussion = await Discussion.query()
      .where('matrix_room_id', roomId)
      .preload('buyer')
      .preload('seller')
      .first()
    if (!discussion) {
      return null
    }
    const target = sender === discussion.buyer.matrixLogin ? discussion.sellerId : discussion.buyerId
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
