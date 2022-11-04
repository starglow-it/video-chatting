import { sendRequest } from '../../../helpers/http/sendRequest';
import { ErrorState } from 'shared-types';
import { monetizationStatisticUrl } from '../../../const/urls/statistics';

export const handleGetUsersMonetizationStatistic = async payload => {
    const response = await sendRequest<PlatformMonetizationResponse, ErrorState>(
        monetizationStatisticUrl(payload),
    );

    if (response.success) {
        return {
            state: response.result,
            error: null,
        };
    }

    if (!response.success) {
        return {
            state: {},
            error: response.error,
        };
    }

    return {
        state: {},
        error: null,
    };
};
