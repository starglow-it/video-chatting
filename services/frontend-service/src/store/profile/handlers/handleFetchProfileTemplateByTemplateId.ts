import {ErrorState, ICommonTemplate, IUserTemplate} from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { profileTemplateByTemplateIdUrl } from '../../../utils/urls';

export const handleFetchProfileTemplateByTemplateId = async ({
    templateId,
}: {
    templateId: ICommonTemplate['templateId'];
}): Promise<IUserTemplate | undefined | null> => {
    const response = await sendRequestWithCredentials<IUserTemplate, ErrorState>(
        profileTemplateByTemplateIdUrl({ templateId }),
    );

    if (!response.success) {
        return response.result;
    }

    return response.result;
};
