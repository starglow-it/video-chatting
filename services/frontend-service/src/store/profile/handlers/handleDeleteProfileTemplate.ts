import { ErrorState, IUserTemplate } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';

import { deleteProfileTemplatesUrl } from '../../../utils/urls';

export const handleDeleteProfileTemplate = async ({
    templateId,
}: {
    templateId: IUserTemplate['id'];
}): Promise<void> => {
    const response = await sendRequestWithCredentials<void, ErrorState>(
        deleteProfileTemplatesUrl({ templateId }),
    );

    if (response.success) {
        return response.result;
    }
};
