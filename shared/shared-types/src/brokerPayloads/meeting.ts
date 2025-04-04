import { QueryParams } from '../common';
import {
  IMeetingInstance,
  ICommonTemplate,
  ICommonUser,
  IUserTemplate,
  KickUserReasons,
  IMeetingAvatar,
  UserRoles,
  MeetingAvatarRole,
} from '../api-interfaces';

export type GetMediaServerTokenPayload = {
  templateId: string;
  userId: string;
};

export type CreateMeetingPayload = {
  templateId: ICommonTemplate['id'];
  subdomain?: ICommonTemplate['subdomain'];
};

export type DeleteMeetingPayload = {
  templateId: ICommonTemplate['id'];
};

export type GetMeetingPayload = {
  meetingId: IMeetingInstance['id'];
};

export type UpdateMeetingInstancePayload = {
  instanceId: IMeetingInstance['instanceId'];
  data: Partial<IMeetingInstance>;
};

export type GetMeetingInstancePayload = Partial<IMeetingInstance>;
export type DeleteMeetingInstancePayload = {
  id: IMeetingInstance['id'];
};
export type CreateMeetingInstancePayload = {
  instanceId: IMeetingInstance['instanceId'];
  serverStatus: IMeetingInstance['serverStatus'];
  snapshotId: IMeetingInstance['snapshotId'];
};
export type AssignMeetingInstancePayload = {
  templateId: IUserTemplate['id'];
  userId: ICommonUser['id'];
  startAt?: string;
  aboutTheHost?: string;
  content?: string;
};

export type KickUserFromMeetingPayload = {
  userId: ICommonUser['id'];
  reason: KickUserReasons;
};

export type GetMeetingAvatarsPayload = QueryParams;

export type CreateMeetingAvatarPayload = {
  resouceId: string;
  roles: MeetingAvatarRole[];
};

export type GetMeetingAvatarPayload = {
  query: Partial<Omit<IMeetingAvatar, 'id'> & { _id: string }>;
};
