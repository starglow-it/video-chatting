import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  DashboardNotification,
  DashboardNotificationDocument,
} from '../../schemas/dashboard-notification.schema';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { GetModelQuery, UpdateModelQuery } from '../../types/custom';

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
    populatePaths,
  }: GetModelQuery<DashboardNotificationDocument>): Promise<
    DashboardNotificationDocument[]
  > {
    return this.dashboardNotification
      .find(query, {}, { session: session.session, populate: populatePaths })
      .exec();
  }

  async updateNotifications({
    query,
    data,
    session,
  }: UpdateModelQuery<
    DashboardNotificationDocument,
    DashboardNotification
  >): Promise<any> {
    return this.dashboardNotification.updateMany(query, data, {
      session: session.session,
    });
  }

  async findAndUpdateNotification({
    query,
    data,
    session,
    populatePaths,
  }: UpdateModelQuery<
    DashboardNotificationDocument,
    DashboardNotification
  >): Promise<any> {
    return this.dashboardNotification.findOneAndUpdate(query, data, {
      session: session.session,
      populate: populatePaths,
      new: true,
    });
  }

  async exists(query) {
    return this.dashboardNotification.exists(query);
  }

  async deleteNotification(id): Promise<any> {
    return this.dashboardNotification.deleteOne({ _id: id });
  }

  async deleteManyNotifications(query): Promise<any> {
    return this.dashboardNotification.deleteMany(query);
  }
}
