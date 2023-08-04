import { ICommonUser } from './users';
import { ICommonTemplate } from './templates';

export enum MeetingInstanceServerStatus {
  Active = 'active',
  Inactive = 'inactive',
  Stopped = 'stopped',
  Pending = 'pending',
}

export interface IMeetingInstance {
  id: string;
  serverIp: string;
  owner: ICommonUser['id'];
  serverStatus: MeetingInstanceServerStatus;
  instanceId: string;
  snapshotId: string;
}

export interface ICreateMeeting {
  userId?: ICommonUser['id'];
  serverIp?: string;
  templateId?: ICommonTemplate['id'];
  subdomain?: ICommonTemplate['subdomain'];
}

export enum MeetingSoundsEnum {
  NewAttendee = 'new_attendee',
}

export interface IGetMeetingToken {
  userId?: ICommonUser['id'];
  templateId?: ICommonTemplate['id'];
}

export interface IInviteAttendeeEmail {
  userEmails: string[];
  meetingId: string;
}

export enum MeetingAccessStatusEnum {
  Initial = 'Initial',
  EnterName = 'enterName',
  Settings = 'settings',
  Waiting = 'waiting',
  RequestSent = 'requestSent',
  InMeeting = 'inMeeting',
  Rejected = 'rejected',
  Kicked = 'Kicked',
  Left = 'Left',
}
