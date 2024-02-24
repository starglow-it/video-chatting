export enum MeetingEmitEvents {
  UpdateMeeting = 'meeting:update',
  FinishMeeting = 'meeting:finished',
  ReceiveAccessRequest = 'meeting:accessRequest:receive',
  AcceptRequest = 'meeting:userAccepted',
  SendMeetingNote = 'meeting:notes:create',
  RemoveMeetingNote = 'meeting:notes:delete',
  SendMeetingNotes = 'meeting:notes:get',
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
  ReceiveRequestRecording= 'meeting:recording:request:receive',
  ReceiveRequestRecordingRejected= 'meeting:recording:request:rejected:receive',
}
