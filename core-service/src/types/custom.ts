import { PopulateOptions } from 'mongoose';

export type CustomPopulateOptions =
  | string
  | string[]
  | PopulateOptions
  | PopulateOptions[];
