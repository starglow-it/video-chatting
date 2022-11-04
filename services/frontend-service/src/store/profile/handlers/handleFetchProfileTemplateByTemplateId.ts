import { UserTemplate } from '../../types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { profileTemplateByTemplateIdUrl } from '../../../utils/urls';
import { ErrorState, ICommonTemplate } from 'shared-types';

export const handleFetchProfileTemplateByTemplateId = async ({
    templateId,
}: {
    templateId: ICommonTemplate['templateId'];
}): Promise<UserTemplate | undefined | null> => {
    const response = await sendRequestWithCredentials<UserTemplate, ErrorState>(
        profileTemplateByTemplateIdUrl({ templateId }),
    );

    if (!response.success) {
        return response.result;
    }

    return response.result;
};
