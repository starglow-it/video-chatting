import {
  IBusinessCategory,
  ICommonTemplate,
  ICommonUser,
  IUpdateTemplate,
  IUserTemplate,
} from '../api-interfaces';
import { QueryParams } from '../common';

export type GetCommonTemplatesPayload = {
  query: Partial<ICommonTemplate>;
  options: QueryParams & { userId?: string };
};

export type GetUserTemplatesPayload = {
  userId: ICommonUser['id'];
} & QueryParams;

export type GetUserTemplatePayload = {
  id: IUserTemplate['id'];
};

export type GetCommonTemplatePayload = Partial<ICommonTemplate>;

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

export type CountUserTemplatesPayload = {
  userId: ICommonUser['id'];
  options: QueryParams;
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

export type CreateTemplatePayload = {
  userId: IUserTemplate['id'];
};

export type EditTemplatePayload = {
  templateId: ICommonTemplate['id'];
  data: Omit<Partial<ICommonTemplate>, 'businessCategories'> & {
    businessCategories: IBusinessCategory[];
  };
};
export type DeleteCommonTemplatePayload = { templateId: ICommonTemplate['id'] };
