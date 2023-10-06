import { AnswerSwitchRoleAction } from 'shared-types';
import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';
import { AnswerSwitchRolePayload } from '../types';
import { updateMeetingUserEvent } from '../../users/meetingUsers/model';
import {
    joinMeetingWithLurkerEvent,
    updateMeetingEvent,
} from '../../meeting/meeting/model';
import { initDevicesEventFxWithStore } from '../../videoChat/localMedia/init';
import { setRoleQueryUrlEvent } from '../../meeting/meetingRole/model';

export const handleReceiveAnswerSwitchRoleFromHost = async (
    data: AnswerSwitchRolePayload,
) => {
    switch (data.action) {
        case AnswerSwitchRoleAction.Accept:
            setRoleQueryUrlEvent(null);
            updateMeetingEvent({ meeting: data?.meeting });
            updateMeetingUserEvent({ user: data?.user });
            await initDevicesEventFxWithStore();
            await joinMeetingWithLurkerEvent();
            break;
        case AnswerSwitchRoleAction.Rejected:
            addNotificationEvent({
                message: `Host rejected request become a Participant`,
                withErrorIcon: true,
                type: NotificationType.validationError,
            });
            break;
        default:
            break;
    }
};
