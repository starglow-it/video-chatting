import {DashboardNotification} from "../../types/dashboard";
import {setDashboardNotifications} from "../../dashboardNotifications/model";

export const handleDashboardNotification = async ({ notification }: { notification: DashboardNotification }) => {
    setDashboardNotifications([notification]);
}