import { ErrorState, IUserTemplate } from 'shared-types';
import { sendRequest } from '../../../helpers/http/sendRequest';
import { userTemplateUrl } from '../../../utils/urls';

export const handleCheckCustomLink = async ({
    templateId,
    customLink,
}: {
    templateId: IUserTemplate['id'];
    customLink: IUserTemplate['customLink'];
}): Promise<boolean> => {
    const response = await sendRequest<IUserTemplate, ErrorState>(
        userTemplateUrl({ templateId: customLink }),
    );

    if (response.success) {
        return (
            Boolean(response.result?.id) && response?.result?.id !== templateId
        );
    }

    return false;
};
