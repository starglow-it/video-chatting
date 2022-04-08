import {root} from "../root";
import {DashboardNotification} from "../types/dashboard";
import {createSocketEvent} from "../socket";

const dashboardNotificationsDomain = root.createDomain('dashboardNotificationsDomain');

export const $dashboardNotificationsStore = dashboardNotificationsDomain.store<DashboardNotification[]>([]);
export const setDashboardNotifications = dashboardNotificationsDomain.event<DashboardNotification[]>();

export const emitGetDashboardNotifications = dashboardNotificationsDomain.event('emitGetDashboardNotifications');
export const emitReadDashboardNotifications = dashboardNotificationsDomain.event('emitGetDashboardNotifications');

export const getDashboardNotifications = createSocketEvent('dashboard:getNotifications');
export const readDashboardNotifications = createSocketEvent('dashboard:readNotifications');
