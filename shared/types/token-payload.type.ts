import { TokenTypes } from "../const/tokens.const";

export type TokenPayloadType = {
    token: string;
    type: TokenTypes;
    expiresAt: number;
};