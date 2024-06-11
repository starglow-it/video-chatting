import { CommonTemplatesList, ErrorState, QueryParams } from 'shared-types';
import { CommonTemplatesListState } from '../../types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { getTemplatesUrl } from '../../../const/urls/templates';

export const handleGetFeaturedTemplates = async (
    payload: QueryParams,
): Promise<CommonTemplatesListState> => {
    const response = await sendRequestWithCredentials<
        CommonTemplatesList,
        ErrorState
    >(getTemplatesUrl(payload));

    console.log('PAYLOAD', 'ROOM RESPONSE', payload, response);

    if (response.success && response.result) {
        return {
            error: null,
            state: response.result,
        };
    }

    if (!response.success) {
        return {
            error: response.error,
            state: {
                list: [],
                count: 0,
            },
        };
    }

    return {
        state: {
            list: [],
            count: 0,
        },
        error: null,
    };
};
