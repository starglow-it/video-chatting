import { IUserCredentials } from '../rest-data';
import { IToken, QueryParams, TokenPayloadType } from '../common';
import {
  ICommonUser,
  IUpdateProfile,
  IUpdateProfileAvatar,
} from '../api-interfaces';

export type CreateUserPayload = {
  user: IUserCredentials;
  token?: TokenPayloadType;
};
export type FindUserByEmailPayload = { email: ICommonUser['email'] };
export type FindUserByEmailAndUpdatePayload = {
  email: ICommonUser['email'];
  data: Partial<ICommonUser>;
};

export type FindUserByIdPayload = {
  userId: ICommonUser['id'];
};

export type FindUsersPayload = {
  query: Partial<ICommonUser>;
  options?: QueryParams;
};

export type SearchUsersPayload = {
  query: Partial<ICommonUser>;
  options?: QueryParams;
};

export type UpdateCountryStatisticsPayload = {
  key: ICommonUser['country'];
  value: number;
};

export type FindUsersByIdPayload = {
  userIds: ICommonUser['id'][];
};

export type FindUserPayload = Partial<ICommonUser>;
export type UpdateUserPayload = {
  query: any;
  data: Partial<ICommonUser>;
};

export type UserExistsPayload = { email: ICommonUser['email'] };
export type UserTokenExistsPayload = IToken['token'];
export type VerifyPasswordPayload = {
  userId?: ICommonUser['id'];
  email?: ICommonUser['email'];
  password: ICommonUser['password'];
};

export type ComparePasswordsPayload = { userId: string; password: string };
export type UpdatePasswordPayload = {
  userId: ICommonUser['id'];
  password: ICommonUser['password'];
};
export type UpdateProfilePayload = {
  userId: string;
  data: Partial<IUpdateProfile>;
};
export type UpdateProfileAvatarPayload = {
  userId: string;
  data: IUpdateProfileAvatar;
};

export type DeleteProfileAvatarPayload = { userId: string };
export type SetVerificationCodePayload = { code: string; userId: string };
export type ValidateVerificationCodePayload = { code: string; userId: string };
export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
  newPasswordRepeat: string;
};
export type CountUsersPayload = Partial<ICommonUser>;
export type ManageUserRightsPayload = {
  userId: ICommonUser['id'];
  key: string;
  value: boolean;
};

export type ResetTrialNotificationPayload = { userId: string };
