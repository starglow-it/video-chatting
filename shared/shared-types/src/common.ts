export type SuccessResult<Result> = {
    result: Result;
    success: true;
};

export type AuthToken = {
    token: string;
    expiresAt: Date;
};

export type FailedResult<Error> = {
    success: false;
    result: undefined;
    error?: Error;
    statusCode?: number;
};

export type ApiParams = {
    token?: string;
};

export type TokenPair = {
    accessToken: AuthToken;
    refreshToken: AuthToken;
};

export enum HttpMethods {
    Post = 'POST',
    Get = 'GET',
    Delete = 'DELETE',
    Put = 'PUT',
}

export type ErrorState = {
    message?: string;
    code?: number;
};

export type ApiError = {
    statusCode: number;
    errorJsonObject: unknown;
    error: unknown;
    message: string;
    errorCode: number;
};