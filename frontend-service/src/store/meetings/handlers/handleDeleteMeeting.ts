import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { ErrorState } from '../../types';
import { deleteMeetingUrl } from '../../../utils/urls';
import { DeleteMeetingPayload } from '../types';

export const handleDeleteMeeting = async (data: DeleteMeetingPayload): Promise<void> => {
    await sendRequestWithCredentials<void, ErrorState>({
        ...deleteMeetingUrl,
        data: {
            templateId: data.templateId,
        },
    });
};
