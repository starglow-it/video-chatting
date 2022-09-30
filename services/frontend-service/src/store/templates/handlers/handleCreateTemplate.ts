import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { ErrorState, Template } from '../../types';
import { createTemplateUrl } from '../../../utils/urls';

export const handleCreateTemplate = async () => {
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
