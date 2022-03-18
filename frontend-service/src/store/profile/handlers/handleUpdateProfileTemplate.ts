import { ErrorState, Template, UpdateTemplateData } from '../../types';
import { postProfileTemplatesUrl } from '../../../utils/urls';
import { initialTemplateState } from '../../meeting';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';

export const handleUpdateProfileTemplate = async ({
    templateId,
    data,
}: UpdateTemplateData): Promise<Template> => {
    const response = await sendRequestWithCredentials<Template, ErrorState>({
        ...postProfileTemplatesUrl({ templateId }),
        data,
    });

    if (response.success) {
        return response.result;
    }

    return initialTemplateState;
};
