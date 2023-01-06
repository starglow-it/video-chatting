import { ErrorState, DeleteMeetingPayload } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { meetingsApiMethods } from '../../../utils/urls';

export const handleDeleteMeeting = async (data: DeleteMeetingPayload): Promise<void> => {
    const deleteMeetingUrl = meetingsApiMethods.deleteMeetingUrl();

    await sendRequestWithCredentials<void, ErrorState>({
        ...deleteMeetingUrl,
        data: {
            templateId: data.templateId,
        },
    });
};
