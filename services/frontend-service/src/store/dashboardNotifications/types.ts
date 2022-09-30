import { DashboardNotification, Profile } from '../types';

export type ReadDashboardNotificationPayload = {
    profileId: Profile['id'];
    notifications: DashboardNotification['id'][];
};
export type GetDashboardNotificationPayload = { profileId: Profile['id'] };
