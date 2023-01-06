import {ErrorState, ICommonTemplate, IUserTemplate} from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { profileApiMethods } from '../../../utils/urls';

export const handleFetchProfileTemplateByTemplateId = async ({
    templateId,
}: {
    templateId: ICommonTemplate['templateId'];
}): Promise<IUserTemplate | undefined | null> => {
    const profileTemplateByTemplateIdUrl = profileApiMethods.profileTemplateByTemplateIdUrl({ templateId });

    const response = await sendRequestWithCredentials<IUserTemplate, ErrorState>(
        profileTemplateByTemplateIdUrl,
    );

    if (!response.success) {
        return response.result;
    }

    return response.result;
};
