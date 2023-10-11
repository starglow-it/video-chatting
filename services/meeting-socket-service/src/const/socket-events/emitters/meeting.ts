export enum MeetingEmitEvents {
  UpdateMeeting = 'meeting:update',
  FinishMeeting = 'meeting:finished',
  ReceiveAccessRequest = 'meeting:accessRequest:receive',
  SendMeetingNote = 'meeting:notes:create',
  RemoveMeetingNote = 'meeting:notes:delete',
  SendMeetingNotes = 'meeting:notes:get',
  SendMeetingError = 'meeting:error',
  PlaySound = 'meeting:sounds.play',
  UpdateMeetingTemplate = 'template:update',
  ReceiveMessage = 'meeting:chat:message:receive',
  ReceiveReaction = 'meeting:chat:reaction:receive',
  ReceiveUnReaction = 'meeting:chat:unreaction:receive'
}
