export enum MeetingChatSubcribeEvent {
  OnSendMessage = 'meetingchat:message:send',
  OnReactionMessage = 'meetingchat:message:reaction',
  OnUnReactionMessage = 'meetingchat:message:unreaction',
  OnLoadMoreMessages = 'meetingchat:message:loadmore'
}
