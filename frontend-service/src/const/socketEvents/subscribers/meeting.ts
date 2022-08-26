export enum MeetingSubscribeEvents {
    OnGetMeetingNotes = 'meeting:notes:get',
    OnUpdateMeeting = 'meeting:update',
    OnMeetingEnterRequest = 'meeting:accessRequest:receive',
    OnFinishMeeting = 'meeting:finished',
    OnUpdateMeetingTemplate = 'template:update',
    OnSendMeetingNote = 'meeting:notes:create',
    OnRemoveMeetingNote = 'meeting:notes:delete',
    OnMeetingError = 'meeting:error',
    OnPlaySound = 'meeting:sounds.play',
    OnMeetingTimeLimit = 'meeting:timeLimit',
}
