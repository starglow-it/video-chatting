import { ErrorState, UserTemplate } from '../../../types';
import { getUserTemplatesUrl } from '../../../../utils/urls';
import { sendRequest } from '../../../../helpers/http/sendRequest';

export const handleCheckCustomLink = async ({
    templateId,
}: {
    templateId: UserTemplate['id'] | UserTemplate['customLink'];
}): Promise<boolean> => {
    const response = await sendRequest<UserTemplate, ErrorState>(
        getUserTemplatesUrl({ templateId }),
    );

    if (response.success) {
        return Boolean(response.result?.id);
    }

    return false;
};
