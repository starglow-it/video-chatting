import {ErrorState, IUserTemplate} from 'shared-types';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';

import { Profile } from '../../types';

import { initialProfileTemplateState } from '../profileTemplate/const';
import {profileApiMethods} from "../../../utils/urls";

export const handleFetchProfileTemplate = async ({
    templateId,
}: {
    templateId: IUserTemplate['id'];
    userId: Profile['id'];
}): Promise<IUserTemplate> => {
    const getProfileTemplateUrl = profileApiMethods.getProfileTemplateUrl({ templateId });

    const response = await sendRequestWithCredentials<IUserTemplate, ErrorState>(
        getProfileTemplateUrl,
    );

    if (response.success) {
        return response.result;
    }

    return initialProfileTemplateState;
};
