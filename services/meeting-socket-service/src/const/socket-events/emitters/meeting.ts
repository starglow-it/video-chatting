export enum MeetingEmitEvents {
  UpdateMeeting = 'meeting:update',
  FinishMeeting = 'meeting:finished',
  ReceiveAccessRequest = 'meeting:accessRequest:receive',
  AcceptRequest = 'meeting:userAccepted',
  SendMeetingNote = 'meeting:notes:create',
  RemoveMeetingNote = 'meeting:notes:delete',
  SendMeetingNotes = 'meeting:notes:get',
  SendMeetingError = 'meeting:error',
  PlaySound = 'meeting:sounds.play',
  UpdateMeetingTemplate = 'template:update',
  UpdateTemplatePayments = 'template:payments:update',
  ReceiveMessage = 'meeting:chat:message:receive',
  ReceiveReaction = 'meeting:chat:reaction:receive',
  RejoinWaititngRoom = 'meeting:room:rejoin',
  ReceiveUnReaction = 'meeting:chat:unreaction:receive',
}
