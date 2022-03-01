import { ErrorState, Template } from '../../types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { getCommonTemplateUrl } from '../../../utils/urls/resolveUrl';

export const handleFetchCommonTemplate = async ({
    templateId,
}: {
    templateId: Template['id'];
}): Promise<Template | undefined> => {
    const response = await sendRequestWithCredentials<Template, ErrorState>(
        getCommonTemplateUrl({ templateId }),
    );

    return response.result;
};
