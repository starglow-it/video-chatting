import { EntityList, IMediaCategory } from 'shared-types';
import sendRequestWithCredentials from '../../../../../helpers/http/sendRequestWithCredentials';
import { removeWaitingUserFromUserTemplateUrl } from '../../../../../utils/urls';
import { NotifyToHostWhileWaitingRoomPayload } from '../types';

export const handleRemoveWaitingUserFromUserTemplate = async (data: NotifyToHostWhileWaitingRoomPayload): Promise<void> => {
    await sendRequestWithCredentials<EntityList<IMediaCategory>, void>({
        ...removeWaitingUserFromUserTemplateUrl(),
        data,
    });
};