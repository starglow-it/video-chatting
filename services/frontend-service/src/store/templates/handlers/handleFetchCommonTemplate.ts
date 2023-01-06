import { ErrorState, ICommonTemplate } from 'shared-types';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { templatesApiMethods } from '../../../utils/urls';

export const handleFetchCommonTemplate = async ({
    templateId,
}: {
    templateId: ICommonTemplate['id'];
}): Promise<ICommonTemplate | undefined> => {
    if (templateId) {
        const getCommonTemplateUrl = templatesApiMethods.getCommonTemplateUrl({ templateId });

        const response = await sendRequestWithCredentials<ICommonTemplate, ErrorState>(
            getCommonTemplateUrl,
        );

        return response.result;
    }

    return;
};
