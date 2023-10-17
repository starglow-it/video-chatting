import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import { IBaseService } from '../../base/base-service.interface';
import {
  TemplatePayment,
  TemplatePaymentDocument,
} from '../../schemas/user-payment.schema';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import {
  GetModelByIdQuery,
  GetModelSingleQuery,
  GetModelMultipleQuery,
  DeleteModelByIdQuery,
  UpdateModelByIdQuery,
  UpdateModelMultipleQuery,
  UpdateModelSingleQuery,
  InserModelMultipleQuery,
  DeleteModelQuery,
} from '../../types/custom';

@Injectable()
export class TemplatePaymentsService
  implements IBaseService<TemplatePaymentDocument>
{
  constructor(
    @InjectModel(TemplatePayment.name)
    private templatePayment: Model<TemplatePaymentDocument>,
  ) {}
  findById(
    args: GetModelByIdQuery<TemplatePaymentDocument>,
  ): Promise<TemplatePaymentDocument> {
    throw new Error('Method not implemented.');
  }
  async findOne({
    query,
    session,
    populatePaths,
  }: GetModelSingleQuery<TemplatePaymentDocument>): Promise<TemplatePaymentDocument> {
    return await this.templatePayment
      .findOne(query, {}, { session: session.session, populate: populatePaths })
      .exec();
  }

  async createMany({
    data,
    session: { session },
  }: InserModelMultipleQuery<TemplatePaymentDocument>): Promise<
    TemplatePaymentDocument[]
  > {
    return this.templatePayment.create(data, { session });
  }

  async find({
    query,
    session,
    options,
    populatePaths,
  }: GetModelMultipleQuery<TemplatePaymentDocument>): Promise<
    TemplatePaymentDocument[]
  > {
    return this.templatePayment
      .find(
        query,
        {},
        {
          sort: options?.sort,
          skip: options?.skip,
          limit: options?.limit,
          session: session?.session,
          populate: populatePaths,
        },
      )
      .exec();
  }

  count(query: FilterQuery<TemplatePaymentDocument>): Promise<number> {
    return this.templatePayment.count(query).exec();
  }

  async findByIdAndUpdate({
    id,
    data,
    session: { session },
    populatePaths,
  }: UpdateModelByIdQuery<TemplatePaymentDocument>): Promise<TemplatePaymentDocument> {
    return this.templatePayment
      .findByIdAndUpdate(id, data, {
        new: true,
        session,
        populate: populatePaths,
      })
      .exec();
  }

  async deleteMany({
    query,
    session: { session },
  }: DeleteModelQuery<TemplatePaymentDocument>): Promise<void> {
    await this.templatePayment.deleteMany(query, { session });
  }

  async findOneAndUpdate({
    query,
    data,
    session,
    populatePaths,
  }: UpdateModelSingleQuery<TemplatePaymentDocument>): Promise<TemplatePaymentDocument> {
    return this.templatePayment
      .findOneAndUpdate(query, data, {
        session: session?.session,
        populate: populatePaths,
        new: true,
      })
      .exec();
  }

  async findByIdAndDelete({
    id,
    session: { session },
  }: DeleteModelByIdQuery<TemplatePaymentDocument>) {
    return await this.templatePayment.findByIdAndRemove(id, {
      session,
      new: true,
    });
  }

  aggregate(
    aggregationPipeline: PipelineStage[],
    session?: ITransactionSession,
  ): Promise<unknown[]> {
    return this.templatePayment
      .aggregate(aggregationPipeline, {
        session: session?.session,
      })
      .exec();
  }

  async updateMany({
    query,
    data,
    session: { session },
    options,
    populatePaths,
  }: UpdateModelMultipleQuery<TemplatePaymentDocument>): Promise<unknown> {
    return await this.templatePayment
      .updateMany(query, data, {
        ...options,
        session,
      })
      .exec();
  }
}
