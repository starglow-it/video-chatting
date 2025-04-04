import { ErrorState } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { purchaseTemplateUrl } from '../../../utils/urls';

export const handlePurchaseTemplate = async ({
    templateId,
}: {
    templateId: string;
}): Promise<{ url: string }> => {
    const response = await sendRequestWithCredentials<string, ErrorState>(
        purchaseTemplateUrl({ templateId }),
    );

    if (response.success) {
        return { url: response.result };
    }

    return { url: '' };
};
