import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { EntityList, ErrorState } from 'shared-types';
import { updateMonetizationTemplateUrl } from 'src/utils/urls';
import {
    PaymentItem,
    UpdatePaymentMeetingPayload,
    UpdatePaymentMeetingResponse,
} from '../type';

export const handleUpdatePaymentMeeting = async (
    params: UpdatePaymentMeetingPayload,
): Promise<UpdatePaymentMeetingResponse> => {
    const response = await sendRequestWithCredentials<
        EntityList<PaymentItem>,
        ErrorState
    >({
        ...updateMonetizationTemplateUrl(params.templateId),
        data: params.data,
    });

    if (response.success) {
        return {
            success: true,
            data: response.result?.list ?? [],
        };
    }

    return {
        success: false,
        data: [],
        message: response.error?.message,
    };
};
