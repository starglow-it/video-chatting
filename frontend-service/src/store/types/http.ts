export enum HttpMethods {
    Post = 'POST',
    Get = 'GET',
    Delete = 'DELETE',
    Put = 'PUT',
}

export type AuthToken = {
    token: string;
    expiresAt: Date;
};

export type ApiError = {
    statusCode: number;
    errorJsonObject: any;
    error: any;
    message: string;
    errorCode: number;
};

export type TokenPair = {
    accessToken: AuthToken;
    refreshToken: AuthToken;
};

export type ApiParams = {
    token?: string;
};

export type SuccessResult<Result> = {
    result: Result;
    success: true;
};

export type FailedResult<Error> = {
    success: false;
    result: undefined;
    error?: Error;
    statusCode?: number;
};

export type EntityList<EntityItem> = {
    list: EntityItem[];
    count: number;
};

export type ErrorState = {
    message?: string;
    code?: number;
};
