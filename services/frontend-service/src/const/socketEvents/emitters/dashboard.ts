export enum DashboardSocketEmitters {
    MeetingAvailable = 'waitingRoom:meetingAvailable',
    EnterWaitingRoom = 'dashboard:sendEnterWaitingRoom',
    JoinDashboard = 'dashboard:join',
    JoinRoomBeforeMeeting = 'dashboard:before-meeting',
    CreateMeeting = 'dashboard:createMeeting',
    GetNotifications = 'dashboard:getNotifications',
    ReadNotifications = 'dashboard:readNotifications',
}
