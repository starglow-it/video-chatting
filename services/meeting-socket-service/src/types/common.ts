import { PopulateOptions } from 'mongoose';

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
    replaceItem: string | null;
  };
}

