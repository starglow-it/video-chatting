import { IUserTemplate } from "../../interfaces/user-template.interface";
import { ICommonTemplate } from "../../interfaces/common-template.interface";
import { ICommonUserDTO } from "../../interfaces/common-user.interface";
import { IUpdateTemplate } from "../../interfaces/update-template.interface";

export type GetCommonTemplatesPayload = { skip: number; limit: number };
export type GetUserTemplatesPayload = {
  userId: ICommonUserDTO["id"];
  skip: number;
  limit: number;
};
export type GetUserTemplatePayload = { id: IUserTemplate["id"] };
export type GetCommonTemplatePayload = { id: ICommonTemplate["id"] };
export type GetUserTemplateByTemplateIdPayload = {
  id: ICommonTemplate["templateId"];
  userId: ICommonUserDTO["id"];
};
export type GetUserTemplateByIdPayload = {
  id: IUserTemplate["id"];
};
export type UpdateUserTemplatePayload = {
  templateId: IUserTemplate["id"];
  data: IUpdateTemplate;
};

export type CreateUserTemplateByIdPayload = {
  id: ICommonTemplate["id"];
  userId: ICommonUserDTO["id"];
};

export type GetUsersTemplatesPayload = {
  userId: ICommonUserDTO["id"];
  skip: number;
  limit: number;
};

export type DeleteUsersTemplatesPayload = { templateId: IUserTemplate["id"], userId: ICommonUserDTO["id"] };
export type AddTemplateToUserPayload = {
  productId: string;
  customerId: string;
};
