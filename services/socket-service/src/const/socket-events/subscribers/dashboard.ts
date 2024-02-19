export enum DashboardSubscribeEvents {
  OnJoinRoomBeforeMeeting = 'dashboard:before-meeting',
  OnGetMeetingStatisticsData = 'dashboard:get:meeting:statistics',
  OnJoinDashboard = 'dashboard:join',
  OnMeetingAvailable = 'waitingRoom:meetingAvailable',
  OnSendEnterWaitingRoom = 'dashboard:sendEnterWaitingRoom',
  OnGetDashboardNotifications = 'dashboard:getNotifications',
  OnReadDashboardNotifications = 'dashboard:readNotifications',
}
