import { TokenTypes } from "../const/tokens.const";

type TokenPayloadType = {
    token: string;
    type: TokenTypes;
    expiresAt: number;
};

export {
    TokenPayloadType
}