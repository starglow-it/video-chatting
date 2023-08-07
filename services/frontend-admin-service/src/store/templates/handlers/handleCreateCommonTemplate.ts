import { ErrorState, ICommonTemplate } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { createCommonTemplateUrl } from '../../../const/urls/templates';
import { CommonTemplateState } from '../../types';

export const handleCreateCommonTemplate = async (
    withSubdomain?: boolean,
): Promise<CommonTemplateState & { withSubdomain?: boolean }> => {
    const response = await sendRequestWithCredentials<
        ICommonTemplate,
        ErrorState
    >({
        ...createCommonTemplateUrl,
    });

    if (response.success) {
        return {
            state: response.result,
            withSubdomain,
            error: null,
        };
    }

    return {
        state: undefined,
        error: response.error,
    };
};
