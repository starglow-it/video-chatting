import { appDomain } from '../domains';
import { createSocketEvent } from '../socket/model';
import { DashboardNotification, Profile } from '../types';
import { EMIT_GET_NOTIFICATIONS, EMIT_READ_NOTIFICATIONS } from '../../const/socketEvents/emitters';

export const $dashboardNotificationsStore = appDomain.createStore<DashboardNotification[]>([]);
export const setDashboardNotifications = appDomain.createEvent<DashboardNotification[]>();

export const getDashboardNotificationsSocketEvent = createSocketEvent<
    { profileId: Profile['id'] },
    DashboardNotification[]
>(EMIT_GET_NOTIFICATIONS);

export const readDashboardNotificationsSocketEvent = createSocketEvent<
    { profileId: Profile['id']; notifications: DashboardNotification['id'][] },
    DashboardNotification[]
>(EMIT_READ_NOTIFICATIONS);
