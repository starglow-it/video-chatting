import { ICommonUser, RoomType } from './api-interfaces';

export type SuccessResult<Result> = {
  result?: Result;
  success: true;
};

export type FilterQuery<T> = {
  [K in keyof T]?: any;
};

export type AuthToken = {
  token: string;
  expiresAt?: Date;
};

export type ErrorState = {
  message?: string;
  code?: number;
};

export type FailedResult<Error = ErrorState> = {
  success: false;
  result?: undefined;
  error?: Error;
  statusCode?: number;
};

export type ApiParams = {
  token?: string;
};

export type QueryParams = {
  skip?: number;
  limit?: number;
  search?: string;
  sort?: any;
  direction?: number;
  templateType?: string;
  draft?: boolean;
  type?: string;
  isHaveSubdomain?: boolean;
  roomType?: RoomType;
};

export interface IToken {
  token: string;
  expiresAt?: number;
}

export type TokenPair = {
  accessToken: IToken;
  refreshToken: IToken;
};

export type TokenPairWithUserType = TokenPair & {
  user: ICommonUser;
};

export enum TokenTypes {
  Confirm = 'confirm',
  Access = 'access',
  Refresh = 'refresh',
  Reset = 'reset',
  ResetPassword = 'reset_password',
}

export enum HttpMethods {
  Post = 'POST',
  Get = 'GET',
  Delete = 'DELETE',
  Put = 'PUT',
  Patch = 'PATCH',
}

export type ApiError = {
  statusCode: number;
  errorJsonObject: unknown;
  error: unknown;
  message: string;
  errorCode: number;
};

export type ResponseSumType<Result, Error = ErrorState> =
  | SuccessResult<Result>
  | FailedResult<Error>;

export type StateWithError<State> = {
  error: ErrorState | null | undefined;
  state: State;
};

export type TokenPayloadType = {
  token: string;
  type: TokenTypes;
  expiresAt?: number;
};

export type EntityList<Entity> = {
  list: Entity[];
  count: number;
};

export enum FileSizeTypesEnum {
  byte = 'byte',
  kilobyte = 'kilobyte',
  megabyte = 'megabyte',
  gigabyte = 'gigabyte',
}

export type Timestamp = {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
};
