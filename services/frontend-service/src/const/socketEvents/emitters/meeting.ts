export enum MeetingSocketEmitters {
    JoinWaitingRoom = 'meeting:waitingRoom:join',
    GetMeetingUserStatistics = 'meeting:get:users',
    StartMeeting = 'meeting:start',
    ClickMeetingLink = 'meeting:link:click',
    EndMeeting = 'meeting:end',
    LeaveMeeting = 'meeting:leave',
    UpdateMeeting = 'meeting:update',
    SendAccessRequest = 'meeting:accessRequest:send',
    AnswerAccessRequest = 'meeting:accessRequest:answer',
    CancelAccessRequest = 'meeting:accessRequest:cancel',
    SendMeetingNote = 'meeting:notes:create',
    RemoveMeetingNote = 'meeting:notes:delete',
    GetMeetingNotes = 'meeting:notes:get',
    SendMeetingReaction = 'meeting:reaction:create',
    RemoveMeetingReaction = 'meeting:reaction:delete',
    GetMeetingReaction = 'meeting:reaction:get',
    SendReconnectMeeting = 'meeting:reconnect',
    JoinWithAudience = 'meeting:audience:join',
    JoinWithRecorder = 'meeting:recorder:join',
    SendMessage = 'meeting:chat:send',
    ReactionMessage = 'meeting:chat:reaction',
    UnReactionMessage = 'meeting:chat:unreaction',
    LoadMoreMessages = 'meeting:chat:loadmore',
    SendReactionMessage = 'meeting:chat:reaction:send',
    SendUnReactionMessage = 'meeting:chat:unreaction:send',
    SendQuestion = 'meeting:question:send',
    ReactionQuestion = 'meeting:question:reaction',
    LoadMoreQuestions = 'meeting:question:loadmore',
    SendUnReactionQuestion = 'meeting:question:unreaction:send',
    RequestRecording = 'meeting:recording:request:send',
}
