import { TokenPayloadType } from "./token-payload.type";

export interface IUserCredentials {
    email?: string;
    userId?: string;
    password: string;
}

export type UserCredentialsWithTokenPair = {
    user: IUserCredentials;
    token: TokenPayloadType;
}