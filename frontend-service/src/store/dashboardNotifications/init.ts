import { combine, sample } from 'effector-next';

import {
    $dashboardNotificationsStore,
    emitGetDashboardNotifications,
    emitReadDashboardNotifications,
    setDashboardNotifications,
    getDashboardNotifications,
    readDashboardNotifications,
} from './model';
import { $profileStore } from '../profile';
import { DashboardNotificationReadStatus } from '../types/dashboard';

sample({
    clock: emitGetDashboardNotifications,
    source: $profileStore,
    fn: profile => ({ profileId: profile.id }),
    target: getDashboardNotifications,
});

sample({
    clock: emitReadDashboardNotifications,
    source: combine({
        profile: $profileStore,
        dashboardNotifications: $dashboardNotificationsStore,
    }),
    fn: ({ profile, dashboardNotifications }) => ({
        profileId: profile.id,
        notifications: dashboardNotifications
            .filter(notification => notification.status === DashboardNotificationReadStatus.active)
            .map(notification => notification.id),
    }),
    target: readDashboardNotifications,
});

$dashboardNotificationsStore.on(
    [
        getDashboardNotifications.doneData,
        readDashboardNotifications.doneData,
        setDashboardNotifications,
    ],
    (state, data) => {
        const allNotifications = [...state, ...data].reverse();

        const allIds = allNotifications.map(notification => notification.id);
        const idSet = new Set(allIds);
        const uniqueIds = [...idSet];

        return uniqueIds.map(notificationId =>
            allNotifications.find(notification => notification.id === notificationId),
        );
    },
);
