import { PopulateOptions } from 'mongoose';

export type CustomPopulateOptions =
  | string
  | string[]
  | PopulateOptions
  | PopulateOptions[];


export enum UpdateIndexUser {
  Leave = 'leave',
  Join = 'join',
}

export type UpdateIndexParams = {
  [K in UpdateIndexUser]?: {
    condition: string | null;
    replaceItem: string | null;
  };
}

