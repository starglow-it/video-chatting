import { ErrorState, ICommonTemplate } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { createFeaturedTemplateUrl } from '../../../const/urls/templates';
import { CommonTemplateState } from '../../types';

export const handleCreateFeaturedTemplate =
    async (): Promise<CommonTemplateState> => {
        const response = await sendRequestWithCredentials<
            ICommonTemplate,
            ErrorState
        >({
            ...createFeaturedTemplateUrl,
        });

        if (response.success) {
            return {
                state: response.result,
                error: null,
            };
        }

        return {
            state: undefined,
            error: response.error,
        };
    };
