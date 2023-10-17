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
  GetModelByIdQuery,
  GetModelMultipleQuery,
  GetModelSingleQuery,
  UpdateModelByIdQuery,
  UpdateModelMultipleQuery,
  UpdateModelSingleQuery,
} from '../types/custom';

export interface IBaseService<T extends Document> {
  findById(args: GetModelByIdQuery<T>): Promise<T>;
  findOne(args: GetModelSingleQuery<T>): Promise<T>;
  find(args: GetModelMultipleQuery<T>): Promise<T[]>;
  findByIdAndUpdate(args: UpdateModelByIdQuery<T>): Promise<T>;
  findOneAndUpdate(args: UpdateModelSingleQuery<T>): Promise<T>;
  findByIdAndDelete(args: DeleteModelByIdQuery<T>): Promise<T>;
  updateMany(args: UpdateModelMultipleQuery<T>): Promise<unknown>;
  count(args: FilterQuery<T>): Promise<number>;
  aggregate(
    aggregationPipeline: PipelineStage[],
    session?: ITransactionSession,
  ): Promise<unknown[]>;
}
