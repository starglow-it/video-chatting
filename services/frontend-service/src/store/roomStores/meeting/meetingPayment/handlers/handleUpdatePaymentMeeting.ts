import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import {
    MeetingPayment,
    UpdatePaymentMeetingPayload,
    UpdatePaymentMeetingResponse,
} from '../type';
import { ErrorState } from 'shared-types';
import { updateMonetizationTemplateUrl } from 'src/utils/urls';

export const handleUpdatePaymentMeeting = async (
    params: UpdatePaymentMeetingPayload,
): Promise<UpdatePaymentMeetingResponse> => {
    const response = await sendRequestWithCredentials<
        MeetingPayment,
        ErrorState
    >({
        ...updateMonetizationTemplateUrl(params.templateId),
        data: params.data,
    });

    if (response.success) {
        return {
            success: true,
            data: response.result,
        };
    }

    return {
        success: false,
        data: undefined,
        message: response.error?.message,
    };
};
