import { ErrorState, IUserTemplate } from 'shared-types';
import { sendRequest } from '../../../helpers/http/sendRequest';
import { getUserTemplateUrl } from '../../../utils/urls';

export const handleCheckCustomLink = async ({
    templateId,
}: {
    templateId: IUserTemplate['id'] | IUserTemplate['customLink'];
}): Promise<boolean> => {
    const response = await sendRequest<IUserTemplate, ErrorState>(
        getUserTemplateUrl({ templateId }),
    );

    if (response.success) {
        return Boolean(response.result?.id);
    }

    return false;
};
