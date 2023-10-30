import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { EntityList, ErrorState } from 'shared-types';
import { getMonetizationTemplateUrl } from 'src/utils/urls';
import { GetPaymentMeetingPayload, PaymentItem } from '../type';

export const handleGetPaymentMeeting = async ({
    templateId,
}: GetPaymentMeetingPayload): Promise<PaymentItem[]> => {
    const response = await sendRequestWithCredentials<
        EntityList<PaymentItem>,
        ErrorState
    >({
        ...getMonetizationTemplateUrl(templateId),
    });

    if (response.success) {
        return response.result?.list ?? [];
    }
    return [];
};
