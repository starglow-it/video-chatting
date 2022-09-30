import { Profile, UserTemplate } from '../types';

export type JoinDashboardPayload = { userId: Profile['id'] };
export type MeetingAvailablePayload = { templateId: UserTemplate['id'] };
export type JoinRoomBeforeMeetingPayload = { templateId: UserTemplate['id'] };
export type StartWaitForServerPayload = { templateId: UserTemplate['id'] };
