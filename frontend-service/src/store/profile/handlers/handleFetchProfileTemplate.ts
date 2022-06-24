import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { getProfileTemplateUrl } from '../../../utils/urls';

import { ErrorState, Profile, Template } from '../../types';

import { initialProfileTemplateState } from '../profileTemplate/model';

export const handleFetchProfileTemplate = async ({
    templateId,
}: {
    templateId: Template['id'];
    userId: Profile['id'];
}): Promise<Template> => {
    const response = await sendRequestWithCredentials<Template, ErrorState>(
        getProfileTemplateUrl({ templateId }),
    );

    if (response.success) {
        return response.result;
    }

    return initialProfileTemplateState;
};
