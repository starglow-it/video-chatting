export enum DashboardSocketEmitters {
    MeetingAvailable = 'waitingRoom:meetingAvailable',
    EnterWaitingRoom = 'dashboard:sendEnterWaitingRoom',
    JoinDashboard = 'dashboard:join',
    JoinRoomBeforeMeeting = 'dashboard:before-meeting',
    GetMeetingStatisticsData = 'dashboard:get:meeting:statistics',
    GetNotifications = 'dashboard:getNotifications',
    ReadNotifications = 'dashboard:readNotifications',
}
