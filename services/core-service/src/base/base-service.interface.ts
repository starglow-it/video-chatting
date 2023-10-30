import {
  Document,
  FilterQuery,
  HydratedDocument,
  PipelineStage,
  QueryWithHelpers,
  UpdateWriteOpResult,
} from 'mongoose';
import { ITransactionSession } from '../helpers/mongo/withTransaction';
import {
  DeleteModelByIdQuery,
  DeleteModelQuery,
  GetModelByIdQuery,
  GetModelMultipleQuery,
  GetModelSingleQuery,
  InserModelMultipleQuery,
  InsertModelSingleQuery,
  UpdateModelByIdQuery,
  UpdateModelMultipleQuery,
  UpdateModelSingleQuery,
} from '../types/custom';

export interface IBaseService<T extends Document> {
  findById?(args: GetModelByIdQuery<T>): Promise<T>;
  findOne?(args: GetModelSingleQuery<T>): Promise<T>;
  find?(args: GetModelMultipleQuery<T>): Promise<T[]>;
  findByIdAndUpdate?(args: UpdateModelByIdQuery<T>): Promise<T>;
  createOne?(args: InsertModelSingleQuery<T>): Promise<T>;
  createMany?(args: InserModelMultipleQuery<T>): Promise<T[]>;
  findOneAndUpdate?(args: UpdateModelSingleQuery<T>): Promise<T>;
  findByIdAndDelete?(args: DeleteModelByIdQuery<T>): Promise<T>;
  deleteMany(args: DeleteModelQuery<T>): Promise<void>;
  exists(args: GetModelSingleQuery<T>['query']): Promise<boolean>;
  updateMany?(args: UpdateModelMultipleQuery<T>): Promise<unknown>;
  count?(args: FilterQuery<T>): Promise<number>;
  aggregate?(
    aggregationPipeline: PipelineStage[],
    session?: ITransactionSession,
  ): Promise<unknown[]>;
}
