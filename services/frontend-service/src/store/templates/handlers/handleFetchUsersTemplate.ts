import { ErrorState, ICommonTemplate, IUserTemplate } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { userTemplateUrl } from '../../../utils/urls';
import { sendRequest } from '../../../helpers/http/sendRequest';

export const handleFetchUserTemplate = async ({
    templateId,
    withCredentials,
}: {
    templateId: ICommonTemplate['id'];
    withCredentials: boolean;
}): Promise<IUserTemplate | undefined | null> => {
    let response;

    if (withCredentials) {
        response = await sendRequestWithCredentials<IUserTemplate, ErrorState>(
            userTemplateUrl({ templateId }),
        );
    } else {
        response = await sendRequest<IUserTemplate, ErrorState>(
            userTemplateUrl({ templateId }),
        );
    }

    if (!response.success) {
        return response.result;
    }

    return response.result;
};
