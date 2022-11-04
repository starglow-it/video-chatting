import { attach, combine, Store } from 'effector-next';

import {
    $dashboardNotificationsStore,
    getDashboardNotificationsSocketEvent,
    readDashboardNotificationsSocketEvent,
    setDashboardNotifications,
} from './model';
import { $profileStore } from '../profile/profile/model';
import { DashboardNotification, DashboardNotificationReadStatus, Profile } from '../types';

export const sendGetDashboardNotificationsSocketEvent = attach<
    void,
    Store<Profile>,
    typeof getDashboardNotificationsSocketEvent
>({
    effect: getDashboardNotificationsSocketEvent,
    source: $profileStore,
    mapParams: (_, profile) => ({ profileId: profile.id }),
});

export const sendReadDashboardNotificationsSocketEvent = attach<
    void,
    Store<{ profile: Profile; dashboardNotifications: DashboardNotification[] }>,
    typeof readDashboardNotificationsSocketEvent
>({
    effect: readDashboardNotificationsSocketEvent,
    source: combine({
        profile: $profileStore,
        dashboardNotifications: $dashboardNotificationsStore,
    }),
    mapParams: (_, { profile, dashboardNotifications }) => ({
        profileId: profile.id,
        notifications: dashboardNotifications
            .filter(notification => notification.status === DashboardNotificationReadStatus.active)
            .map(notification => notification.id),
    }),
});

$dashboardNotificationsStore.on(
    [
        getDashboardNotificationsSocketEvent.doneData,
        readDashboardNotificationsSocketEvent.doneData,
        setDashboardNotifications,
    ],
    (state, data) => {
        const allNotifications = [...state, ...data].reverse();

        const allIds = allNotifications.map(notification => notification.id);
        const idSet = new Set(allIds);
        const uniqueIds = [...idSet];

        return uniqueIds
            .map(notificationId =>
                allNotifications.find(notification => notification.id === notificationId),
            )
            .filter(notification => notification?.id) as DashboardNotification[];
    },
);
