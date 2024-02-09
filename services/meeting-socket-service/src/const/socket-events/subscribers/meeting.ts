export enum MeetingSubscribeEvents {
  OnUpdateMeeting = 'meeting:update',
  OnJoinWaitingRoom = 'meeting:waitingRoom:join',
  OnStartMeeting = 'meeting:start',
  OnSendAccessRequest = 'meeting:accessRequest:send',
  OnCancelAccessRequest = 'meeting:accessRequest:cancel',
  OnAnswerAccessRequest = 'meeting:accessRequest:answer',
  OnEndMeeting = 'meeting:end',
  OnLeaveMeeting = 'meeting:leave',
  OnSendMeetingNote = 'meeting:notes:create',
  OnRemoveMeetingMote = 'meeting:notes:delete',
  OnGetMeetingNotes = 'meeting:notes:get',
  OnSendMeetingReaction = 'meeting:reaction:create',
  OnGetMeetingReaction = 'meeting:reaction:get',
  OnUpdateMeetingTemplate = 'template:update',
  OnReconnect = 'meeting:reconnect',
  OnJoinMeetingWithAudience = 'meeting:audience:join',
  OnSendMessage = 'meeting:chat:send',
  OnReactionMessage = 'meeting:chat:reaction:send',
  OnUnReactionMessage = 'meeting:chat:unreaction:send',
  OnLoadMoreMessages = 'meeting:chat:loadmore',
  OnSendQuestion = 'meeting:question:send',
  OnReactionQuestion = 'meeting:question:reaction',
  OnUnReactionQuestion = 'meeting:question:unreaction:send',
  OnLoadMoreQuestions = 'meeting:question:loadmore',
  OnUpdateTemplatePayments = 'template:payments:update',
}
