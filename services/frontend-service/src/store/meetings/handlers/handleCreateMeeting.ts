import { CreateMeetingPayload } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { createMeetingUrl } from '../../../utils/urls';
import { CreateMeetingResponse } from '../types';


export const handleCreateMeeting = async (
    data: CreateMeetingPayload,
): Promise<CreateMeetingResponse> => {
    const response = await sendRequestWithCredentials<
        CreateMeetingResponse['template'],
        CreateMeetingResponse['error']
    >({
        ...createMeetingUrl,
        data: {
            templateId: data.templateId,
        },
    });

    if (response.success) {
        return {
            template: response.result,
        };
    }
    return {
        error: response.error,
    };
};
