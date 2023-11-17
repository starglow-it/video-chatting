import {
    ErrorState,
    ICommonTemplate,
    TemplateCategoryType,
} from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { createTemplateUrl } from '../../../utils/urls';
import { CreateTemplateResponse } from '../types';

export const handleCreateTemplate = async (
    type: TemplateCategoryType | undefined,
): Promise<CreateTemplateResponse> => {
    const response = await sendRequestWithCredentials<
        ICommonTemplate,
        ErrorState
    >({
        ...createTemplateUrl,
        data: type
            ? {
                  categoryType: type,
              }
            : undefined,
    });

    if (response.success) {
        return response.result;
    }

    return null;
};
