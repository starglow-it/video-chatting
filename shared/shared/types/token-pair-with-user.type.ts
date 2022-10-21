import {ICommonUserDTO} from "../interfaces/common-user.interface";

export type TokenType = {
    token: string;
    expiresAt: number;
};

export type TokenPairWithUserType = {
    accessToken: TokenType;
    refreshToken: TokenType;
    user: ICommonUserDTO;
}