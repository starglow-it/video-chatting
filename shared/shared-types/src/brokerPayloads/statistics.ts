import { ICommonUser, IUserTemplate } from '../api-interfaces';

type IncreaseRoomTransactionStatisticPayload = {
  templateId: IUserTemplate['id'];
};

type GetRoomRatingStatisticPayload = {
  ratingKey: string;
  roomKey: string;
};

type GetMonetizationStatisticPayload = {
  period: string;
  type: string;
};

type UpdateRoomRatingStatisticPayload = {
  ratingKey: 'minutes' | 'calls' | 'transactions' | 'uniqueUsers' | 'money';
  templateId: IUserTemplate['id'];
  userId?: ICommonUser['id'];
  value: number;
};

type UpdateMonetizationStatisticPayload = {
  period: 'lastMonth' | 'allTime';
  type: string;
  value: number;
};

export type {
  IncreaseRoomTransactionStatisticPayload,
  GetRoomRatingStatisticPayload,
  UpdateRoomRatingStatisticPayload,
  UpdateMonetizationStatisticPayload,
  GetMonetizationStatisticPayload,
};
