import { ErrorState, ICommonTemplate } from 'shared-types';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { getCommonTemplateUrl } from '../../../utils/urls';

export const handleFetchCommonTemplate = async ({
    templateId,
}: {
    templateId: ICommonTemplate['id'];
}): Promise<ICommonTemplate | undefined> => {
    const response = await sendRequestWithCredentials<
        ICommonTemplate,
        ErrorState
    >(getCommonTemplateUrl({ templateId }));

    return response.result;
};
