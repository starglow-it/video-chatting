import { Profile } from '../types';
import {IUserTemplate} from "shared-types";

export type JoinDashboardPayload = { userId: Profile['id'] };
export type MeetingAvailablePayload = { templateId: IUserTemplate['id'] };
export type JoinRoomBeforeMeetingPayload = { templateId: IUserTemplate['id'] };
export type StartWaitForServerPayload = { templateId: IUserTemplate['id'] };
