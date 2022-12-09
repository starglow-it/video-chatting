import {
  FilterQuery,
  PopulateOptions,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { ITransactionSession } from '../helpers/mongo/withTransaction';
import { QueryParams } from 'shared-types';

export type CustomPopulateOptions =
  | string
  | string[]
  | PopulateOptions
  | PopulateOptions[];

export type GetModelQuery<Document> = {
  query: FilterQuery<Document>;
  session?: ITransactionSession;
  populatePaths?: QueryOptions['populate'];
  options?: QueryParams;
};

export type UpdateModelQuery<Document, Interface> = {
  query: FilterQuery<Document>;
  data: UpdateQuery<Interface>;
  session?: ITransactionSession;
  options?: QueryParams;
  populatePaths?: QueryOptions['populate'];
};
