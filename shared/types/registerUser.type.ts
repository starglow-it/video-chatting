import { TokenPayloadType } from "./token-payload.type";

interface IUserCredentials {
    email?: string;
    userId?: string;
    password: string;
}

type UserCredentialsWithTokenPair = {
    user: IUserCredentials;
    token: TokenPayloadType;
}

export {
    IUserCredentials,
    UserCredentialsWithTokenPair
}