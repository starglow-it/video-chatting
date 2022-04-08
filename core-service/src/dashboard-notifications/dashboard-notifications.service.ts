import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import {
  DashboardNotification,
  DashboardNotificationDocument,
} from '../schemas/dashboard-notification.schema';
import { ITransactionSession } from '../helpers/mongo/withTransaction';
import { CustomPopulateOptions } from '../types/custom';

@Injectable()
export class DashboardNotificationsService {
  constructor(
    @InjectModel(DashboardNotification.name)
    private dashboardNotification: Model<DashboardNotificationDocument>,
  ) {}

  async createNotification(
    data,
    { session }: ITransactionSession,
  ): Promise<DashboardNotificationDocument[]> {
    return this.dashboardNotification.create([data], { session });
  }

  async findNotifications({
    query,
    session,
    populatePath,
  }: {
    query: FilterQuery<DashboardNotificationDocument>;
    session: ITransactionSession;
    populatePath: CustomPopulateOptions;
  }): Promise<DashboardNotificationDocument[]> {
    return this.dashboardNotification
      .find(query, {}, { session: session.session, populate: populatePath })
      .exec();
  }

  async updateNotifications({
    query,
    data,
    session,
  }: {
    query: FilterQuery<DashboardNotificationDocument>;
    data: any;
    session: ITransactionSession;
  }): Promise<any> {
    return this.dashboardNotification.updateMany(query, data, {
      session: session.session,
    });
  }

  async findAndUpdateNotification({
    query,
    data,
    session,
    populatePath,
  }: {
    query: FilterQuery<DashboardNotificationDocument>;
    data: any;
    session: ITransactionSession;
    populatePath?: CustomPopulateOptions;
  }): Promise<any> {
    return this.dashboardNotification.findOneAndUpdate(query, data, {
      session: session.session,
      populate: populatePath,
      new: true,
    });
  }

  async exists(query) {
    return this.dashboardNotification.exists(query);
  }

  async deleteNotification(id): Promise<any> {
    return this.dashboardNotification.deleteOne({ _id: id });
  }
}
