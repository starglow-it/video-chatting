import { EntityList, IMediaCategory } from 'shared-types';
import sendRequestWithCredentials from '../../../../../helpers/http/sendRequestWithCredentials';
import { notifyToHostWhileWaitingRoomUrl } from '../../../../../utils/urls';
import { NotifyToHostWhileWaitingRoomPayload } from '../types';
import { addNotificationEvent } from '../../../../../store';
import { NotificationType } from '../../../../../store/types';


export const handleNotifyToHostWhileWaitingRoom = async (data: NotifyToHostWhileWaitingRoomPayload): Promise<void> => {
    const { success } = await sendRequestWithCredentials<EntityList<IMediaCategory>, void>({
        ...notifyToHostWhileWaitingRoomUrl(),
        data,
    });

    if (success) {
        addNotificationEvent({
            type: NotificationType.MicAction,
            message: `meeting.isHostNotified`,
        });
    }
};