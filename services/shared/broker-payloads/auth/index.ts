import { IToken } from "../../interfaces/token.interface";
import { IUserCredentials } from "../../types/registerUser.type";
import { TokenPairWithUserType } from "../../types/token-pair-with-user.type";
import { ICommonUserDTO } from "../../interfaces/common-user.interface";
import { TokenPayloadType } from "../../types/token-payload.type";

export type LoginUserByEmailPayload = IUserCredentials;
export type AssignTokensToUserPayload = TokenPairWithUserType;
export type SetResetPasswordTokenPayload = {
  email: ICommonUserDTO["email"];
  token: TokenPayloadType;
};
export type RegisterUserPayload = IUserCredentials;
export type RefreshTokenPayload = IToken;
export type LogOutUserPayload = IToken;
export type SendResetPasswordLinkEmailPayload = Pick<IUserCredentials, "email">;
export type ConfirmUserRegistrationPayload = {
  token: string;
};
