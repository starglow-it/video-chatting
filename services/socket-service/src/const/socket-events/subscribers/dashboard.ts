export enum DashboardSubscribeEvents {
  OnJoinRoomBeforeMeeting = 'dashboard:before-meeting',
  OnJoinDashboard = 'dashboard:join',
  OnCreateMeeting = 'dashboard:createMeeting',
  OnMeetingAvailable = 'waitingRoom:meetingAvailable',
  OnSendEnterWaitingRoom = 'dashboard:sendEnterWaitingRoom',
  OnGetDashboardNotifications = 'dashboard:getNotifications',
  OnReadDashboardNotifications = 'dashboard:readNotifications',
}
