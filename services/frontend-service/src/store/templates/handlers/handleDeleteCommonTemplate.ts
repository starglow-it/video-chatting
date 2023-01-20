import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { ErrorState } from '../../types';
import { deleteTemplateUrl } from '../../../utils/urls';
import { DeleteCommonTemplatePayload } from '../types';

export const handleDeleteCommonTemplate = async ({ templateId }: DeleteCommonTemplatePayload) => {
    const response = await sendRequestWithCredentials<void, ErrorState>({
        ...deleteTemplateUrl({ templateId }),
    });

    return response.success;
};
