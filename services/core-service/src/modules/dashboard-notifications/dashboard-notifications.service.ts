import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IDashboardNotification } from 'shared-types';

import {
  DashboardNotification,
  DashboardNotificationDocument,
} from '../../schemas/dashboard-notification.schema';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import {
  GetModelMultipleQuery,
  UpdateModelMultipleQuery,
  UpdateModelSingleQuery,
} from '../../types/custom';

@Injectable()
export class DashboardNotificationsService {
  constructor(
    @InjectModel(DashboardNotification.name)
    private dashboardNotification: Model<DashboardNotificationDocument>,
  ) {}

  async createNotification({
    data,
    session,
  }: {
    data: Omit<IDashboardNotification, 'id'>;
    session: ITransactionSession;
  }): Promise<DashboardNotificationDocument> {
    const [newNotification] = await this.dashboardNotification.create([data], {
      session: session?.session,
    });

    return newNotification;
  }

  async findNotifications({
    query,
    session,
    populatePaths,
  }: GetModelMultipleQuery<DashboardNotificationDocument>): Promise<
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
  }: UpdateModelMultipleQuery<DashboardNotificationDocument>): Promise<any> {
    return this.dashboardNotification
      .updateMany(query, data, {
        session: session.session,
      })
      .exec();
  }

  async findAndUpdateNotification({
    query,
    data,
    session,
    populatePaths,
  }: UpdateModelSingleQuery<DashboardNotificationDocument>): Promise<DashboardNotificationDocument> {
    return this.dashboardNotification.findOneAndUpdate(query, data, {
      session: session?.session,
      populate: populatePaths,
      new: true,
    });
  }

  async exists(query): Promise<boolean> {
    const data = await this.dashboardNotification.exists(query);

    return Boolean(data?._id);
  }

  async deleteNotification(id): Promise<any> {
    await this.dashboardNotification.deleteOne({ _id: id });

    return;
  }

  async deleteManyNotifications(query): Promise<any> {
    await this.dashboardNotification.deleteMany(query);

    return;
  }
}
