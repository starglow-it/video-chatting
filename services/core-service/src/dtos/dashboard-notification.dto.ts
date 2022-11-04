import { Expose, Transform, Type } from 'class-transformer';

import {
  DashboardNotificationReadStatus,
  DashboardNotificationTypes,
  IDashboardNotificationUser,
  IDashboardNotification,
  IUserTemplate,
} from 'shared-types';

// dtos
import { UserTemplateDTO } from './user-template.dto';
import { DashboardNotificationUserDTO } from './dashboard-notification-user.dto';

export class DashboardNotificationDTO implements IDashboardNotification {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  sentAt: number;

  @Expose()
  notificationType: DashboardNotificationTypes;

  @Expose()
  status: DashboardNotificationReadStatus;

  @Expose()
  @Type(() => UserTemplateDTO)
  @Transform((data) => ({
    id: data?.obj?.template?.['_id'],
    name: data?.obj?.template?.['name'],
  }))
  template: IUserTemplate;

  @Expose()
  @Type(() => DashboardNotificationUserDTO)
  sender: IDashboardNotificationUser;

  @Expose()
  @Type(() => DashboardNotificationUserDTO)
  receiver: IDashboardNotificationUser;

  @Expose()
  isSenderGuest: boolean;

  @Expose()
  senderFullName: string;
}
