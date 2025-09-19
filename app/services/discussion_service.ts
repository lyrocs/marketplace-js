import Discussion from '#models/discussion'

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
}
