export enum MeetingSubscribeEvents {
    OnGetMeetingNotes = 'meeting:notes:get:response',
    OnGetMeetingReactions = 'meeting:reaction:get',
    OnUpdateMeeting = 'meeting:update',
    OnUserAccepted = 'meeting:userAccepted',
    OnMeetingEnterRequest = 'meeting:accessRequest:receive',
    OnFinishMeeting = 'meeting:finished',
    OnUpdateMeetingTemplate = 'template:update',
    OnSendMeetingNote = 'meeting:notes:created',
    OnRemoveMeetingNote = 'meeting:notes:delete',
    OnSendMeetingReaction = 'meeting:reaction:create',
    OnRemoveMeetingReaction = 'meeting:reaction:delete',
    OnMeetingError = 'meeting:error',
    OnPlaySound = 'meeting:sounds.play',
    OnMeetingTimeLimit = 'meeting:timeLimit',
    OnReceiveMessage = 'meeting:chat:message:receive',
    OnReceiveReaction = 'meeting:chat:reaction:receive',
    OnReceiceUnReaction = 'meeting:chat:unreaction:receive',
    OnRejoinWaitingRoom = 'meeting:rejoin',
    OnReceiveQuestion = 'meeting:question:question:receive',
    OnReceiveQuestionReaction = 'meeting:question:reaction:receive',
    OnReceiceQuestionUnReaction = 'meeting:question:unreaction:receive',
    OnReceiveTranscriptionMessage = 'meeting:transcription:get',
    OnReceiveRequestRecording = 'meeting:recording:request:receive',
    OnReceiveRequestRecordingRejected = 'meeting:recording:request:rejected:receive',
    OnReceiveRequestRecordingAccepted = 'meeting:recording:request:accepted:receive',
    OnReceiveStartRecordingPending = 'meeting:start:recording:pending:receive',
    OnReceiveStopRecordingPending = 'meeting:stop:recording:pending:receive',
    OnGetMeetingUrlReceive = 'meeting:get:recording:url:receive',
    OnGetMeetingUrlsReceive = 'meeting:get:recording:urls:receive',
    OnGetMeetingUrlsReceiveFail = 'meeting:get:recording:urls:receive:fail',
    OnGetUrlByAttendee = 'meeting:get:recording:url:by:attendee',
    OnGetUrlFailDueToPermission = 'meeting:get:recording:url:fail:duoto:permission',
    OnGetUrlFailDueToHostPermission = 'meeting:get:recording:url:fail:duoto:host:permission',
    OnGetUrlByAttendeeFailDueToHostPermission = 'meeting:get:recording:url:by:attendee:fail:duoto:host:permission',
    OnAttendeeRequestWhenDnd = 'users:attendee:request:when:dnd:receive',
    OnAiTranscriptionReceive = 'meeting:ai:transcription:on:receive',
    OnIsRecordingStarted = 'meeting:is:recording:started',
}
