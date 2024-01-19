import { appDomain } from '../domains';
import { createSocketEvent } from '../socket/model';
import { DashboardNotification, welcomeTour, joyride } from '../types';
import { DashboardSocketEmitters } from '../../const/socketEvents/emitters';
import {
    GetDashboardNotificationPayload,
    ReadDashboardNotificationPayload,
} from './types';

export const $dashboardNotificationsStore = appDomain.createStore<
    DashboardNotification[]
>([]);

export const $joyrideStore = appDomain.createStore<joyride>({ runDashboardJoyride:false, runMeetingJoyride: false });
export const emitDashboardJoyrideEvent = appDomain.createEvent<joyride>("emitDashboardJoyrideEvent");
export const emitMeetingJoyrideEvent = appDomain.createEvent<joyride>("emitMeetingJoyrideEvent");
export const $welcomeTourStore = appDomain.createStore<welcomeTour>({ status: false });
export const enableWelcomeTourEvent = appDomain.createEvent<welcomeTour>("enableWelcomeTourEvent");

export const setDashboardNotifications =
    appDomain.createEvent<DashboardNotification[]>();

export const getDashboardNotificationsSocketEvent = createSocketEvent<
    GetDashboardNotificationPayload,
    DashboardNotification[]
>(DashboardSocketEmitters.GetNotifications);

export const readDashboardNotificationsSocketEvent = createSocketEvent<
    ReadDashboardNotificationPayload,
    DashboardNotification[]
>(DashboardSocketEmitters.ReadNotifications);