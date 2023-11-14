import {
  ICommonTemplate,
  ICommonUser,
  ITemplatePayment,
  IUpdateTemplate,
  IUserTemplate,
  MeetingRole,
} from '../api-interfaces';
import { FilterQuery, QueryParams } from '../common';

export type GetCommonTemplatesPayload = {
  query: FilterQuery<ICommonTemplate>;
  options: QueryParams & { userId?: string };
};

export type GetUserTemplatesPayload = {
  userId: ICommonUser['id'];
} & QueryParams;

export type GetUserTemplatePayload = {
  id: IUserTemplate['id'];
  subdomain?: string;
};

export type GetCommonTemplatePayload = FilterQuery<ICommonTemplate>;

export type GetUserTemplateByTemplateIdPayload = {
  id: ICommonTemplate['templateId'];
  userId: ICommonUser['id'];
};

export type GetUserTemplateByIdPayload = {
  id: IUserTemplate['id'];
};

export type UpdateUserTemplatePayload = {
  templateId: IUserTemplate['id'];
  userId: ICommonUser['id'];
  data: Partial<IUpdateTemplate>;
};

export type UpdateTemplatePaymentsData = {
  [K in ITemplatePayment['type']]?: {
    [K in Exclude<MeetingRole, 'host'>]: Pick<
      ITemplatePayment,
      'currency' | 'enabled' | 'price'
    >;
  };
};

export type GetTemplatePaymentsPayload = {
  userTemplateId: string;
};

export type GetTemplatePaymentPayload = {
  paymentType: string;
  userTemplateId: string;
  meetingRole: MeetingRole
};

export type UpdateTemplatePaymentPayload = {
  userTemplateId: IUserTemplate['id'];
  userId: ICommonUser['id'];
  data: UpdateTemplatePaymentsData;
};

export type CreateUserTemplateByIdPayload = {
  id: ICommonTemplate['id'];
  userId: ICommonUser['id'];
};

export type GetUsersTemplatesPayload = {
  userId: ICommonUser['id'];
} & QueryParams;

export type DeleteUsersTemplatesPayload = {
  templateId: IUserTemplate['id'];
  userId: ICommonUser['id'];
};

export type DeleteGlobalUserTemplatesPayload = {
  userId: ICommonUser['id'];
};

export type CountUserTemplatesPayload = {
  userId: ICommonUser['id'];
  options: QueryParams;
};

export type DeleteLeastUsedTemplatesPayload = {
  userId: ICommonUser['id'];
  templatesLimit: number;
};

export type AddTemplateToUserPayload = {
  templateId: string;
  userId: string;
};

export type UploadTemplateFilePayload = {
  url: ICommonTemplate['url'];
  id: ICommonTemplate['id'];
  mimeType: string;
};

export type UploadCommonTemplateFilePayload = {
  file: File;
  templateId: ICommonTemplate['id'];
};

export type GetCommonTemplateByIdPayload = {
  templateId: ICommonTemplate['id'];
};

export type UpdateTemplatePayload = {
  templateId: IUserTemplate['id'];
  userId: ICommonUser['id'];
  data: Partial<IUserTemplate>;
};

export type UpdateCommonTemplatePayload = {
  templateId: ICommonTemplate['id'];
  data: Partial<ICommonTemplate>;
};

export type CreateTemplatePayload = {
  userId: ICommonTemplate['id'];
  roomType?: ICommonTemplate['roomType'];
  categoryType?: ICommonTemplate['categoryType'];
};

export type EditTemplatePayload = {
  templateId: ICommonTemplate['id'];
  data: Partial<IUpdateTemplate>;
};
export type DeleteCommonTemplatePayload = { templateId: ICommonTemplate['id'] };
