// subscribe events
import { DashboardSubscribeEvents } from '../../../const/socketEvents/subscribers';

// handlers
import { handleMeetingAvailable } from './handleMeetingAvailable';
import { handleDashboardNotification } from './handleDashboardNotification';
import { handleTrialExpired } from './handleTrialExpired';

// utils
import { emptyFunction } from '../../../utils/functions/emptyFunction';

type SocketHandlerData = {
    handler: (...args: any[]) => void;
};

type DashboardSocketHandlerDataMap = Map<DashboardSubscribeEvents, SocketHandlerData>;

const DASHBOARD_SUBSCRIBE_HANDLERS_REGISTRY: DashboardSocketHandlerDataMap = new Map([
    [
        DashboardSubscribeEvents.OnSendDashboardNotification,
        { handler: handleDashboardNotification },
    ],
    [DashboardSubscribeEvents.OnMeetingAvailable, { handler: handleMeetingAvailable }],
    [DashboardSubscribeEvents.OnTrialExpired, { handler: handleTrialExpired }],
]);

export const getDashboardSocketSubscribeHandler = (
    eventName: DashboardSubscribeEvents,
): SocketHandlerData['handler'] =>
    DASHBOARD_SUBSCRIBE_HANDLERS_REGISTRY.get(eventName)?.handler || emptyFunction;
