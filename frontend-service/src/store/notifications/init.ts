import {
    $notificationsStore,
    addNotificationEvent,
    removeNotification,
} from './model';
import {NotificationType} from "../types";

$notificationsStore
    .on(addNotificationEvent, (state, payload) => {
        if (payload.type === NotificationType.MicAction) {
            return [
                state[state.length - 1],
                {
                    type: NotificationType.MicAction,
                    message: `meeting.mic.${payload.data.isMicActive ? 'on' : 'off'}`,
                },
            ];
        } else if (payload.type === NotificationType.CamAction) {
            return [
                state[state.length - 1],
                {
                    type: NotificationType.CamAction,
                    message: `meeting.cam.${payload.data.isCameraActive ? 'on' : 'off'}`,
                },
            ];
        } else if (payload.type === NotificationType.DevicesAction) {
            return [
                state[state.length - 1],
                {
                    type: NotificationType.DevicesAction,
                    message: `meeting.devices.saved`,
                },
            ];
        } else if (payload.type === NotificationType.MeetingInfoCopied) {
            return [
                state[state.length - 1],
                {
                    type: NotificationType.DevicesAction,
                    message: `meeting.copy.info`,
                },
            ];
        } else if (payload.type === NotificationType.LinkInfoCopied) {
            return [
                state[state.length - 1],
                {
                    type: NotificationType.LinkInfoCopied,
                    message: `meeting.copy.link`,
                },
            ];
        } else {
            return [
                state[state.length - 1],
                payload,
            ];
        }
    })
    .on(removeNotification, state => state.slice(1));
