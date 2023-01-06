import {ErrorState, IUserTemplate} from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';

import { profileApiMethods } from '../../../utils/urls';

export const handleDeleteProfileTemplate = async ({
    templateId,
}: {
    templateId: IUserTemplate['id'];
}): Promise<void> => {
    const deleteProfileTemplatesUrl = profileApiMethods.deleteProfileTemplatesUrl({ templateId });

    const response = await sendRequestWithCredentials<void, ErrorState>(
        deleteProfileTemplatesUrl,
    );

    if (response.success) {
        return response.result;
    }
};
