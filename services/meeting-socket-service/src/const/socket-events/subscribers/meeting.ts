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
  OnUpdateMeetingTemplate = 'template:update',
  OnReconnect = 'meeting:reconnect',
  OnJoinMeetingWithLurker = 'meeting:lurker:join'
}
