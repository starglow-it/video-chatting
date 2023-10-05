import { AnswerSwitchRoleAction } from 'shared-types';
import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';
import { AnswerSwitchRolePayload } from '../types';
import { updateMeetingUsersEvent } from '../../users/meetingUsers/model';
import { updateMeetingEvent } from '../../meeting/meeting/model';

export const handleAnswerSwitchRole = async (data: AnswerSwitchRolePayload) => {
    switch (data.action) {
        case AnswerSwitchRoleAction.Accept:
            updateMeetingUsersEvent({ users: data.users });
            updateMeetingEvent({ meeting: data.meeting });

            break;
        case AnswerSwitchRoleAction.Rejected:
            addNotificationEvent({
                message: `User "${data.user.username}" rejected request become a Participant`,
                withErrorIcon: true,
                type: NotificationType.validationError,
            });
            break;
        default:
            break;
    }
};
