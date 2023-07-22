import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { IMonitoring } from 'shared-types';
import { ITransactionSession } from 'src/helpers/mongo/withTransaction';
import { Monitoring, MonitoringDocument } from 'src/schemas/monitoring.schema';
import { GetModelQuery, UpdateModelQuery } from 'src/types/custom';

@Injectable()
export class MonitoringService {
    constructor(
        @InjectModel(Monitoring.name) private monitoring: Model<MonitoringDocument>
    ) { }

    async find({
        query,
        options,
        session,
    }: GetModelQuery<MonitoringDocument>) {
        return this.monitoring
            .find(
                query,
                {},
                {
                    skip: options?.skip,
                    limit: options?.limit,
                    sort: options?.sort,
                    session: session?.session
                },
            )
            .exec();
    }

    async findOne({
        query,
        session,
        populatePaths,
    }: GetModelQuery<MonitoringDocument>): Promise<MonitoringDocument> {
        return this.monitoring
            .findOne(query, {}, { session: session?.session, populate: populatePaths })
            .exec();
    }


    async create({
        data,
        session,
    }: {
        data: Partial<IMonitoring>;
        session?: ITransactionSession;
    }): Promise<MonitoringDocument> {
        const [newData] = await this.monitoring.create([data], {
            session: session?.session,
        });

        return newData;
    }

    async findOneAndUpdate({
        query,
        data,
        session,
        populatePaths,
    }: UpdateModelQuery<
        MonitoringDocument,
        MonitoringDocument
    >): Promise<MonitoringDocument> {
        return this.monitoring.findOneAndUpdate(query, data, {
            session: session?.session,
            populate: populatePaths,
            new: true,
        });
    }

    async count(query: FilterQuery<MonitoringDocument>): Promise<number> {
        return this.monitoring.count(query).exec();
    }

    async delete({
        query,
        session,
    }: {
        query: FilterQuery<MonitoringDocument>;
        session?: ITransactionSession;
    }): Promise<any> {
        return this.monitoring.deleteMany(query, {
            session: session?.session,
        });
    }

}