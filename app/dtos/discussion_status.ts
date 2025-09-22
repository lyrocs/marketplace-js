import DiscussionStatus from "#models/discussion_status"

export default class DiscussionStatusDto {
  declare discussionId: number
  declare userId: string
  declare newMessages: boolean

  constructor(discussionStatus?: DiscussionStatus) {
    if (!discussionStatus) return
    this.discussionId = discussionStatus.discussionId
    this.userId = discussionStatus.userId
    this.newMessages = discussionStatus.newMessage
  }
}
