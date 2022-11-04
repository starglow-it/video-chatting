import {IUserCredentials} from "../rest-data";
import {IToken, TokenPairWithUserType, TokenPayloadType} from "../common";
import {ICommonUser} from "../api-interfaces";

export type LoginUserByEmailPayload = IUserCredentials;
export type RegisterUserPayload = IUserCredentials;

export type AssignTokensToUserPayload = TokenPairWithUserType;
export type SetResetPasswordTokenPayload = {
    email: ICommonUser["email"];
    token: TokenPayloadType;
};
export type RefreshTokenPayload = IToken;
export type LogOutUserPayload = IToken;
export type ConfirmUserRegistrationPayload = IToken;
export type SendResetPasswordLinkEmailPayload = Pick<ICommonUser, "email">;
