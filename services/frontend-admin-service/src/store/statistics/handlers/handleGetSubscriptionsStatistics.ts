import { ErrorState } from 'shared-types';

import { SubscriptionsStatisticsResponse, SubscriptionsStatisticsState } from '../../types';
import { sendRequest } from '../../../helpers/http/sendRequest';
import { subscriptionsStatisticsUrl } from '../../../const/urls/statistics';

export const handleGetSubscriptionsStatistics = async (): Promise<SubscriptionsStatisticsState> => {
    const response = await sendRequest<SubscriptionsStatisticsResponse, ErrorState>(
        subscriptionsStatisticsUrl,
    );

    if (response.success) {
        return {
            state: response.result,
            error: null,
        };
    }

    if (!response.success) {
        return {
            state: {
                totalNumber: 0,
                subscriptions: [],
            },
            error: response.error,
        };
    }

    return {
        state: {
            totalNumber: 0,
            subscriptions: [],
        },
        error: null,
    };
};
