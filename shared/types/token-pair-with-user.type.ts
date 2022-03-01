import {ICommonUserDTO} from "../interfaces/common-user.interface";

type TokenType = {
    token: string;
    expiresAt: number;
};

type TokenPairWithUserType = {
    accessToken: TokenType;
    refreshToken: TokenType;
    user: ICommonUserDTO;
}

export {
    TokenType,
    TokenPairWithUserType
}