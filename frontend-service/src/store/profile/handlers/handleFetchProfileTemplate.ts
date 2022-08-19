import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { getProfileTemplateUrl } from '../../../utils/urls';

import { ErrorState, Profile, UserTemplate } from '../../types';

import { initialProfileTemplateState } from '../profileTemplate/const';

export const handleFetchProfileTemplate = async ({
    templateId,
}: {
    templateId: UserTemplate['id'];
    userId: Profile['id'];
}): Promise<UserTemplate> => {
    const response = await sendRequestWithCredentials<UserTemplate, ErrorState>(
        getProfileTemplateUrl({ templateId }),
    );

    if (response.success) {
        return response.result;
    }

    return initialProfileTemplateState;
};
