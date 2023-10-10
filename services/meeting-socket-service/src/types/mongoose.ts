import {
  FilterQuery,
  PopulateOptions,
  QueryOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import { ITransactionSession } from '../helpers/mongo/withTransaction';
import { QueryParams } from 'shared-types';

export type CustomPopulateOptions =
  | string
  | string[]
  | PopulateOptions
  | PopulateOptions[];

export type GetModelQuery<Entity> = {
  query: FilterQuery<Entity>;
  session?: ITransactionSession;
  populatePaths?: QueryOptions['populate'];
  options?: QueryParams;
};

export type InsertModelQuery<Entity> = {
  data: Partial<Entity>;
  session: ITransactionSession;
};

export type DeleteModelQuery<Entity> = {
  query: FilterQuery<Entity>;
  session: ITransactionSession;
};

export type UpdateModelQuery<Entity> = {
  query: FilterQuery<Entity>;
  data: UpdateQuery<Entity> | UpdateWithAggregationPipeline;
  session: ITransactionSession;
  options?: QueryParams;
  populatePaths?: QueryOptions['populate'];
};
