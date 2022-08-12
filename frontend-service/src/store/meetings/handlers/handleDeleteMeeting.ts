import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { ErrorState, Template } from '../../types';
import { deleteMeetingUrl } from '../../../utils/urls';

export const handleDeleteMeeting = async (data: { templateId: Template['id'] }): Promise<any> => {
    const response = await sendRequestWithCredentials<any, ErrorState>({
        ...deleteMeetingUrl,
        data: {
            templateId: data.templateId,
        },
    });

    if (response.success) {
        return {
            meeting: response.result,
        };
    }
    return {
        error: response.error,
    };
};
