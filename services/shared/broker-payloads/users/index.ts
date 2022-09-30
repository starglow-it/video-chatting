import { TokenPayloadType } from "../../types/token-payload.type";
import { IUserCredentials } from "../../types/registerUser.type";
import { ICommonUserDTO } from "../../interfaces/common-user.interface";
import { IToken } from "../../interfaces/token.interface";
import { IUpdateProfile } from "../../interfaces/update-profile.interface";
import { IUpdateProfileAvatar } from "../../interfaces/update-profile-avatar.interface";

export type CreateUserPayload = {
  user: IUserCredentials;
  token: TokenPayloadType;
};
export type FindUserByEmailPayload = { email: ICommonUserDTO["email"] };
export type FindUserByEmailAndUpdatePayload = {
  email: ICommonUserDTO["email"];
  data: Partial<ICommonUserDTO>;
};

export type FindUserByIdPayload = {
  userId: ICommonUserDTO["id"];
};

export type FindUsersByIdPayload = {
  userIds: ICommonUserDTO["id"][];
};

export type FindUserPayload = Partial<ICommonUserDTO>;
export type UpdateUserPayload = {
  query: any;
  data: Partial<ICommonUserDTO>;
};

export type UserExistsPayload = { email: ICommonUserDTO["email"] };
export type UserTokenExistsPayload = IToken["token"];
export type VerifyPasswordPayload = {
  userId?: ICommonUserDTO["id"];
  email?: ICommonUserDTO["email"];
  password: ICommonUserDTO["password"];
};

export type ComparePasswordsPayload = { userId: string; password: string };
export type UpdatePasswordPayload = {
  userId: ICommonUserDTO["id"];
  password: ICommonUserDTO["password"];
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
