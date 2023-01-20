import { ErrorState, ICommonTemplate } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { createTemplateUrl } from '../../../utils/urls';
import { CreateTemplateResponse } from '../types';

export const handleCreateTemplate = async (): Promise<CreateTemplateResponse> => {
    const response = await sendRequestWithCredentials<ICommonTemplate, ErrorState>({
        ...createTemplateUrl,
    });

    if (response.success) {
        return response.result;
    }

    return null;
};
