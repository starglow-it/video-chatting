export interface IAudienceJoinMeeting {
  meetingId: string;
  username: string;
  meetingAvatarId: string;
  userLocation?: {
    country: string;
    state: string;
  }
}
