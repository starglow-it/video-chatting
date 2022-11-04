import { ErrorState, ICommonTemplate } from 'shared-types';

import { UserTemplate } from '../../types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { userTemplateUrl } from '../../../utils/urls';
import { sendRequest } from '../../../helpers/http/sendRequest';

export const handleFetchUserTemplate = async ({
    templateId,
    withCredentials,
}: {
    templateId: ICommonTemplate['id'];
    withCredentials: boolean;
}): Promise<UserTemplate | undefined | null> => {
    let response;

    if (withCredentials) {
        response = await sendRequestWithCredentials<UserTemplate, ErrorState>(
            userTemplateUrl({ templateId }),
        );
    } else {
        response = await sendRequest<UserTemplate, ErrorState>(userTemplateUrl({ templateId }));
    }

    if (!response.success) {
        return response.result;
    }

    return response.result;
};
