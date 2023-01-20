import {ErrorState, ICommonTemplate, IUserTemplate} from 'shared-types';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { commitUserTemplateChangesUrl } from '../../../utils/urls';

export const handleCommitUserTemplateChanges = async (params: { templateId: IUserTemplate["id"] }): Promise<void> => {
    await sendRequestWithCredentials<ICommonTemplate, ErrorState>(commitUserTemplateChangesUrl(params));

    return;
}

