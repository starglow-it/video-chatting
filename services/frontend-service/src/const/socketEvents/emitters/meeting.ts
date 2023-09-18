export enum MeetingSocketEmitters {
    JoinWaitingRoom = 'meeting:waitingRoom:join',
    StartMeeting = 'meeting:start',
    EndMeeting = 'meeting:end',
    LeaveMeeting = 'meeting:leave',
    UpdateMeeting = 'meeting:update',
    SendAccessRequest = 'meeting:accessRequest:send',
    AnswerAccessRequest = 'meeting:accessRequest:answer',
    CancelAccessRequest = 'meeting:accessRequest:cancel',
    SendMeetingNote = 'meeting:notes:create',
    RemoveMeetingNote = 'meeting:notes:delete',
    GetMeetingNotes = 'meeting:notes:get',
    SendReconnectMeeting = 'meeting:reconnect'
}
