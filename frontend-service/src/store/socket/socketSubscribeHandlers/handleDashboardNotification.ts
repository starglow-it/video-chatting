import { setDashboardNotifications } from '../../dashboardNotifications/model';
import { DashboardNotification } from '../../types';

export const handleDashboardNotification = async ({
    notification,
}: {
    notification: DashboardNotification;
}) => {
    setDashboardNotifications([notification]);
};
