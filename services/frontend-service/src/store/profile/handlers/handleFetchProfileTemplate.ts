import {ErrorState, IUserTemplate} from 'shared-types';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { getProfileTemplateUrl } from '../../../utils/urls';

import { Profile } from '../../types';

import { initialProfileTemplateState } from '../profileTemplate/const';

export const handleFetchProfileTemplate = async ({
    templateId,
}: {
    templateId: IUserTemplate['id'];
    userId: Profile['id'];
}): Promise<IUserTemplate> => {
    const response = await sendRequestWithCredentials<IUserTemplate, ErrorState>(
        getProfileTemplateUrl({ templateId }),
    );

    if (response.success) {
        return response.result;
    }

    return initialProfileTemplateState;
};
