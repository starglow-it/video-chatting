import { PopulateOptions } from 'mongoose';
import { MeetingUserDocument } from '../schemas/meeting-user.schema';

export type CustomPopulateOptions =
  | string
  | string[]
  | PopulateOptions
  | PopulateOptions[];

export enum UserActionInMeeting {
  Leave = 'leave',
  Join = 'join',
}

export type UserActionInMeetingParams = {
  [K in UserActionInMeeting]?: {
    condition: string | null;
    errMessage: string;
    replaceItem: string | null;
  };
};

export type SocketData = Partial<{
  user: MeetingUserDocument;
  error: any;
}>;
