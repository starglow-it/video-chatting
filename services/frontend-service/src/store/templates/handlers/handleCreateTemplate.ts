import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { createTemplateUrl } from '../../../utils/urls';
import { ErrorState, Template } from '../../types';
import { CreateTemplateResponse } from '../types';

export const handleCreateTemplate = async (): Promise<CreateTemplateResponse> => {
    const response = await sendRequestWithCredentials<Template, ErrorState>({
        ...createTemplateUrl,
    });

    if (response.success) {
        return {
            ...response.result,
        };
    }

    return null;
};
