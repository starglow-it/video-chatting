import { sendContactFormUrl } from 'src/utils/urls';
import { sendRequest } from '../../../../helpers/http/sendRequest';
import { ContactFormPayload, ContactFormResponse, ErrorState } from '../../../types';

export const handleSendContactForm = async (params: ContactFormPayload) => {
    const response = await sendRequest<ContactFormResponse, ErrorState>({
        ...sendContactFormUrl,
        data: params,
    });

    if (response.success) {
        return {
            success: response.success,
        };
    }

    return {
        success: response.success,
        error: response?.error,
    };
};
