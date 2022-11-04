import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';

import { UserTemplate } from '../../types';
import { deleteProfileTemplatesUrl } from '../../../utils/urls';

import { ErrorState } from 'shared-types';

export const handleDeleteProfileTemplate = async ({
    templateId,
}: {
    templateId: UserTemplate['id'];
}): Promise<void> => {
    const response = await sendRequestWithCredentials<void, ErrorState>(
        deleteProfileTemplatesUrl({ templateId }),
    );

    if (response.success) {
        return response.result;
    }
};
