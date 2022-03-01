import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { getUserTemplateUrl } from '../../../utils/urls/resolveUrl';

import { ErrorState, Profile, Template } from '../../types';
import { initialProfileTemplateState } from '../profileTemplate';

export const handleFetchProfileTemplate = async ({
    templateId,
    userId,
}: {
    templateId: Template['id'];
    userId: Profile['id'];
}): Promise<Template> => {
    const response = await sendRequestWithCredentials<Template, ErrorState>(
        getUserTemplateUrl({ templateId, userId }),
    );

    if (response.success) {
        return response.result;
    }

    return initialProfileTemplateState;
};
