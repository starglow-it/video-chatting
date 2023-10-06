import { AnswerSwitchRoleAction } from 'shared-types';
import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';
import { AnswerSwitchRolePayload } from '../types';
import { updateMeetingUserEvent } from '../../users/meetingUsers/model';
import { updateMeetingEvent } from '../../meeting/meeting/model';
import { initDevicesEventFxWithStore } from '../../videoChat/localMedia/init';
import { setRoleQueryUrlEvent } from '../../meeting/meetingRole/model';
import { publishTracksEvent } from '../../videoChat/sfu/model';
import { putStreamToLocalStreamEvent } from '../../videoChat/localMedia/model';

export const handleReceiveAnswerSwitchRoleFromHost = async (
    data: AnswerSwitchRolePayload,
) => {
    switch (data.action) {
        case AnswerSwitchRoleAction.Accept:
            await initDevicesEventFxWithStore();
            setRoleQueryUrlEvent(null);
            updateMeetingEvent({ meeting: data?.meeting });
            updateMeetingUserEvent({ user: data?.user });
            publishTracksEvent();
            putStreamToLocalStreamEvent();
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
