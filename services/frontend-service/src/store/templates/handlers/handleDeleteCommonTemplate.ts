import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { templatesApiMethods } from '../../../utils/urls';
import { DeleteCommonTemplatePayload } from '../types';
import {ErrorState} from "shared-types";

export const handleDeleteCommonTemplate = async ({ templateId }: DeleteCommonTemplatePayload) => {
    if (templateId) {
        const deleteTemplateUrl = templatesApiMethods.deleteTemplateUrl({ templateId });

        const response = await sendRequestWithCredentials<void, ErrorState>({
            ...deleteTemplateUrl,
        });

        return response.success;
    }

    return null;
};
