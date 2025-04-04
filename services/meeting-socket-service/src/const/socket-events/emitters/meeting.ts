export enum MeetingEmitEvents {
  UpdateMeeting = 'meeting:update',
  FinishMeeting = 'meeting:finished',
  ReceiveAccessRequest = 'meeting:accessRequest:receive',
  AcceptRequest = 'meeting:userAccepted',
  SendMeetingNote = 'meeting:notes:created',
  RemoveMeetingNote = 'meeting:notes:delete',
  SendMeetingNotes = 'meeting:notes:get:response',
  SendMeetingReaction = 'meeting:reaction:create',
  RemoveMeetingReaction = 'meeting:reaction:delete',
  GetMeetingReaction = 'meeting:reaction:get',
  SendMeetingError = 'meeting:error',
  PlaySound = 'meeting:sounds.play',
  UpdateMeetingTemplate = 'template:update',
  UpdateTemplatePayments = 'template:payments:update',
  ReceiveMessage = 'meeting:chat:message:receive',
  ReceiveReaction = 'meeting:chat:reaction:receive',
  RejoinWaitingRoom = 'meeting:rejoin',
  ReceiveUnReaction = 'meeting:chat:unreaction:receive',
  ReceiveQuestion = 'meeting:question:question:receive',
  ReceiveQuestionReaction = 'meeting:question:reaction:receive',
  ReceiveQuestionUnReaction = 'meeting:question:unreaction:receive',
  SendTranscriptionMessage = 'meeting:transcription:get',
  ReceiveRequestRecording = 'meeting:recording:request:receive',
  ReceiveRequestRecordingRejected = 'meeting:recording:request:rejected:receive',
  ReceiveRequestRecordingAccepted = 'meeting:recording:request:accepted:receive',
  ReceiveStartRecordingPending = 'meeting:start:recording:pending:receive',
  ReceiveStopRecordingPending = 'meeting:stop:recording:pending:receive',
  GetMeetingUrlReceive = 'meeting:get:recording:url:receive',
  GetMeetingUrlsReceive = 'meeting:get:recording:urls:receive',
  GetMeetingUrlsReceiveFail = 'meeting:get:recording:urls:receive:fail',
  GetUrlByAttendee = 'meeting:get:recording:url:by:attendee',
  GetUrlFailDueToPermission = 'meeting:get:recording:url:fail:duoto:permission',
  GetUrlFailDueToHostPermission = 'meeting:get:recording:url:fail:duoto:host:permission',
  GetUrlByAttendeeFailDueToHostPermission = 'meeting:get:recording:url:by:attendee:fail:duoto:host:permission',
  ReceiveAiTranscriptionOn = 'meeting:ai:transcription:on:receive',
  IsRecordingStarted = 'meeting:is:recording:started',
}
