import {
  FilterQuery,
  PopulateOptions,
  QueryOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import { ITransactionSession } from '../helpers/mongo/withTransaction';
import { QueryParams } from 'shared-types';

type OmitOptions = 'options';

export type CustomPopulateOptions =
  | string
  | string[]
  | PopulateOptions
  | PopulateOptions[];

export type GetModelMultipleQuery<Entity> = {
  query: FilterQuery<Entity>;
  session?: ITransactionSession;
  populatePaths?: QueryOptions['populate'];
  options?: QueryParams;
};

export type GetModelSingleQuery<Entity> = Omit<
  GetModelMultipleQuery<Entity>,
  OmitOptions
>;

export type GetModelByIdQuery<Entity> = Omit<
  GetModelSingleQuery<Entity>,
  'query'
> & { id: string };

export type InsertModelQuery<Entity> = {
  data: Partial<Entity>;
  session: ITransactionSession;
};

export type DeleteModelQuery<Entity> = {
  query: FilterQuery<Entity>;
  session: ITransactionSession;
};

export type DeleteModelByIdQuery<Entity> = Omit<
  DeleteModelQuery<Entity>,
  'query'
> & { id: string };

export type UpdateModelMultipleQuery<Entity> = {
  query: FilterQuery<Entity>;
  data: UpdateQuery<Entity> | UpdateWithAggregationPipeline;
  session?: ITransactionSession;
  options?: QueryParams;
  populatePaths?: QueryOptions['populate'];
};

export type UpdateModelSingleQuery<Entity> = Omit<
  UpdateModelMultipleQuery<Entity>,
  OmitOptions
>;

export type UpdateModelByIdQuery<Entity> = Omit<
  UpdateModelSingleQuery<Entity>,
  'query'
> & { id: string };
