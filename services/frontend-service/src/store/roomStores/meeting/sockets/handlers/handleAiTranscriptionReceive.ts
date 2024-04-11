
import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';

export const handleAiTranscriptionReceive = () => {
    addNotificationEvent({
        type: NotificationType.IsAiTranscriptionTurnedOnByHost,
        message: "aiTranscriptionTurnOnNotification",
    });
};
