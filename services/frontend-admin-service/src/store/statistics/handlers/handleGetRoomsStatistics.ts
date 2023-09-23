import { ErrorState } from 'shared-types';
import { sendRequest } from '../../../helpers/http/sendRequest';
import { RoomsStatisticsState, RoomsStatisticsResponse } from '../../types';
import { roomsStatisticsUrl } from '../../../const/urls/statistics';

export const handleGetRoomsStatistics =
    async (): Promise<RoomsStatisticsState> => {
        const response = await sendRequest<RoomsStatisticsResponse, ErrorState>(
            roomsStatisticsUrl,
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
                    rooms: [],
                },
                error: response.error,
            };
        }

        return {
            state: {
                totalNumber: 0,
                rooms: [],
            },
            error: null,
        };
    };
