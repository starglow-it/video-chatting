export enum MeetingSubscribeEvents {
  OnGetMeetings = 'meeting:get',
  OnGetMeetingUsersStatistics = 'meeting:get:users',
  OnUpdateMeeting = 'meeting:update',
  OnJoinWaitingRoom = 'meeting:waitingRoom:join',
  OnStartMeeting = 'meeting:start',
  OnClickMeetingLink = 'meeting:link:click',
  OnSendAccessRequest = 'meeting:accessRequest:send',
  OnCancelAccessRequest = 'meeting:accessRequest:cancel',
  OnAnswerAccessRequest = 'meeting:accessRequest:answer',
  OnEndMeeting = 'meeting:end',
  OnLeaveMeeting = 'meeting:leave',
  OnSendMeetingNote = 'meeting:notes:create',
  OnRemoveMeetingMote = 'meeting:notes:delete',
  OnGetMeetingNotes = 'meeting:notes:get',
  OnSendMeetingReaction = 'meeting:reaction:create',
  OnRemoveMeetingReaction = 'meeting:reaction:delete',
  OnGetMeetingReaction = 'meeting:reaction:get',
  OnUpdateMeetingTemplate = 'template:update',
  OnReconnect = 'meeting:reconnect',
  OnJoinMeetingWithAudience = 'meeting:audience:join',
  OnJoinMeetingWithRecorder = 'meeting:recorder:join',
  OnSendMessage = 'meeting:chat:send',
  OnReactionMessage = 'meeting:chat:reaction:send',
  OnUnReactionMessage = 'meeting:chat:unreaction:send',
  OnLoadMoreMessages = 'meeting:chat:loadmore',
  OnSendQuestion = 'meeting:question:send',
  OnReactionQuestion = 'meeting:question:reaction',
  OnUnReactionQuestion = 'meeting:question:unreaction:send',
  OnLoadMoreQuestions = 'meeting:question:loadmore',
  OnUpdateTemplatePayments = 'template:payments:update',
  OnStartTranscription = 'meeting:transcription:start',
  OnRequestRecording = 'meeting:recording:request:send',
  OnRequestRecordingRejected = 'meeting:recording:request:rejected:send',
  OnRequestRecordingAccepted = 'meeting:recording:request:accepted:send',
  OnStartRecordingPending = 'meeting:start:recording:pending',
  OnStopRecordingPending = 'meeting:stop:recording:pending',
  OnStartRecording = 'meeting:start:recording:send',
  OnSaveRecordingUrl = 'meeting:save:recording:url:send',
  OnGetRecordingVideoById = 'meeting:get:recording:video:by:id:send',
  OnGetRecordingUrlById = 'meeting:get:recording:url:by:id:send',
  OnGetRecordingUrls = 'meeting:get:recording:urls:send',
  OnIsMeetingRecording = 'meeting:set:is:meeting:recording:send',
  OnDeleteRecordingVideo = 'meeting:delete:recording:video',
  OnUpdateRecordingVideoPrice = 'meeting:update:recording:video:price',
  OnSetDonations = 'meeting:set:meeting:donations',
  OnPaymentPrePayment = 'meeting:paywall:pre:paid',
  OnGeneratePrePaymentCodeRequest = 'meeting:generate:pre:payment:code:request',
  OnCheckPrePaymentCodeRequest = 'meeting:check:pre:payment:code:request',
  OnSendAiTranscription = 'meeting:send:ai:transcription:request',
}
