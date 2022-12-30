import {
  ICommonUser,
  ITemplateSoundFile,
  IUserTemplate,
} from '../api-interfaces';

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

type CreateTemplateSoundPayload = {
  url: ITemplateSoundFile['url'];
  mimeType: ITemplateSoundFile['mimeType'];
  fileName: ITemplateSoundFile['fileName'];
  size: ITemplateSoundFile['size'];
  uploadKey: ITemplateSoundFile['uploadKey'];
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
  GetUserProfileStatisticPayload,
  UpdateUserProfileStatisticPayload,
  UpdateUserTemplateUsageNumberPayload,
  CreateTemplateSoundPayload,
};
