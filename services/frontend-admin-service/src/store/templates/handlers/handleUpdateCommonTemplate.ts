import {
    ErrorState,
    ICommonTemplate,
    UpdateCommonTemplatePayload,
} from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { updateCommonTemplateUrl } from '../../../const/urls/templates';
import { CommonTemplateState } from '../../types';

export const handleUpdateCommonTemplate = async (
    params: UpdateCommonTemplatePayload,
): Promise<CommonTemplateState> => {
    const response = await sendRequestWithCredentials<
        ICommonTemplate,
        ErrorState
    >({
        ...updateCommonTemplateUrl({
            templateId: params.templateId,
        }),
        data: params.data,
    });

    if (response.success && response.result) {
        return {
            state: response.result,
            error: null,
        };
    }
    return {
        state: undefined,
        error: (response?.error as any) ?? null,
    };
};
