import { ErrorState } from 'shared-types';
import { UsersStatisticsResponse, UsersStatisticsState } from '../../types';
import { sendRequest } from '../../../helpers/http/sendRequest';
import { usersStatisticsUrl } from '../../../const/urls/statistics';

export const handleGetUsersStatistics =
    async (): Promise<UsersStatisticsState> => {
        const response = await sendRequest<UsersStatisticsResponse, ErrorState>(
            usersStatisticsUrl,
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
                    users: [],
                },
                error: response.error,
            };
        }

        return {
            state: {
                totalNumber: 0,
                users: [],
            },
            error: null,
        };
    };
