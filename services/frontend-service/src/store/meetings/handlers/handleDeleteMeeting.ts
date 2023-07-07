import { ErrorState, DeleteMeetingPayload } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { deleteMeetingUrl } from '../../../utils/urls';

export const handleDeleteMeeting = async (
    data: DeleteMeetingPayload,
): Promise<void> => {
    await sendRequestWithCredentials<void, ErrorState>({
        ...deleteMeetingUrl,
        data: {
            templateId: data.templateId,
        },
    });
};
