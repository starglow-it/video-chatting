import { ICommonUser, UserRoles } from './users';
import { ICommonTemplate } from './templates';
import { IResouce } from './resouces';

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

export enum MeetingAvatarStatus {
  Active = 'active',
  Inative = 'inactive',
}

export enum MeetingAvatarRole {
  LoggedIn = 'logged_in',
  NoLogin = 'no_login',
}

export enum MeetingRole {
  Host = 'host',
  Participant = 'participant',
  Audience = 'audience',
  Recorder = 'recorder'
}

export enum MeetingAccessStatusEnum {
  Initial = 'Initial',
  EnterName = 'enterName',
  Settings = 'settings',
  Waiting = 'waiting',
  RequestSent = 'requestSent',
  RequestSentWhenDnd = 'requestSentWhenDnd',
  InMeeting = 'inMeeting',
  Rejected = 'rejected',
  SwitchRoleSent = 'switchRoleSend',
  Kicked = 'Kicked',
  Left = 'Left',
  Disconnected = 'disconnected',
}

export enum AnswerSwitchRoleAction {
  Accept = 'accept',
  Rejected = 'rejected',
}
export interface IMeetingAvatar {
  id?: string;
  resouce: IResouce;
  status: MeetingAvatarStatus;
  roles: MeetingAvatarRole[];
}

export enum MeetingReactionKind {
  RollingEyes = 'RollingEyes',
  Crying = 'Crying',
  Smiling = 'Smiling',
  Heart = 'Heart',
  TearsOfJoy = 'TearsOfJoy',
  Like = 'Like',
}
