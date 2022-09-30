import { appDomain } from '../domains';
import { createSocketEvent } from '../socket/model';
import { DashboardNotification } from '../types';
import { DashboardSocketEmitters } from '../../const/socketEvents/emitters';
import { GetDashboardNotificationPayload, ReadDashboardNotificationPayload } from './types';

export const $dashboardNotificationsStore = appDomain.createStore<DashboardNotification[]>([]);
export const setDashboardNotifications = appDomain.createEvent<DashboardNotification[]>();

export const getDashboardNotificationsSocketEvent = createSocketEvent<
    GetDashboardNotificationPayload,
    DashboardNotification[]
>(DashboardSocketEmitters.GetNotifications);

export const readDashboardNotificationsSocketEvent = createSocketEvent<
    ReadDashboardNotificationPayload,
    DashboardNotification[]
>(DashboardSocketEmitters.ReadNotifications);
