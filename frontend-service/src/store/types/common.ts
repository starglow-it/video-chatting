import { Meeting, MeetingUser } from './meeting';

export type JoinMeetingResult = { user?: MeetingUser; meeting?: Meeting; users?: MeetingUser[] };
