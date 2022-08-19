import { ErrorState, Template, UserTemplate } from '../../types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { userTemplateUrl } from '../../../utils/urls';

const handleFetchUserTemplate = async ({
    templateId,
}: {
    templateId: Template['templateId'];
}): Promise<UserTemplate | undefined | null> => {
    const response = await sendRequestWithCredentials<UserTemplate, ErrorState>(
        userTemplateUrl({ templateId }),
    );

    if (!response.success) {
        return response.result;
    }

    return response.result;
};

export { handleFetchUserTemplate };
