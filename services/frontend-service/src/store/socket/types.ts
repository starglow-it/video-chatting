import { IUserTemplate } from 'shared-types';
import { Profile } from '../types';

export type JoinDashboardPayload = { userId: Profile['id'] };
export type MeetingAvailablePayload = { templateId: IUserTemplate['id'] };
export type JoinRoomBeforeMeetingPayload = { templateId: IUserTemplate['id'] };
export type getStatisticsDataPayload = { meetingId?: string, userId: string };
export type StartWaitForServerPayload = { templateId: IUserTemplate['id'] };
