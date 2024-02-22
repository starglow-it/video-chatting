import { ICommonUser, IUserTemplate } from '../api-interfaces';

type IncreaseRoomTransactionStatisticPayload = {
  templateId: IUserTemplate['id'];
};

type GetRoomsPayload = {
  author: string;
};

type GetMeetingAttendeesStatisticsPayload = {
  meetingId: string;
};

type GetRoomRatingStatisticPayload = {
  ratingKey: string;
  roomKey: string;
};

type GetMonetizationStatisticPayload = {
  period: string;
  type: string;
};

type GetUserProfileStatisticPayload = {
  userId: ICommonUser['id'];
};

type UpdateUserProfileStatisticPayload = {
  userId: ICommonUser['id'];
  statisticKey: string;
  value: number;
};

type UpdateRoomRatingStatisticPayload = {
  ratingKey: 'minutes' | 'calls' | 'transactions' | 'uniqueUsers' | 'money';
  templateId: IUserTemplate['id'];
  userId?: ICommonUser['id'];
  value: number;
};

type UpdateUserTemplateUsageNumberPayload = {
  templateId: IUserTemplate['id'];
  value: number;
};

type UpdateMonetizationStatisticPayload = {
  period: 'lastMonth' | 'allTime';
  type: string;
  value: number;
};

export type {
  GetRoomsPayload,
  GetMeetingAttendeesStatisticsPayload,
  IncreaseRoomTransactionStatisticPayload,
  GetRoomRatingStatisticPayload,
  UpdateRoomRatingStatisticPayload,
  UpdateMonetizationStatisticPayload,
  GetMonetizationStatisticPayload,
  GetUserProfileStatisticPayload,
  UpdateUserProfileStatisticPayload,
  UpdateUserTemplateUsageNumberPayload,
};
