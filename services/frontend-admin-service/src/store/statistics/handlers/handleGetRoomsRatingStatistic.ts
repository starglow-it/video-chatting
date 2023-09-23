import { ErrorState } from 'shared-types';
import { sendRequest } from '../../../helpers/http/sendRequest';
import {
    RoomsRatingStatisticState,
    RoomsRatingStatisticResponse,
    GetRoomRatingStatisticParams,
} from '../../types';
import { roomsRatingStatisticUrl } from '../../../const/urls/statistics';

export const handleGetRoomsRatingStatistic = async (
    payload: GetRoomRatingStatisticParams,
): Promise<RoomsRatingStatisticState> => {
    const response = await sendRequest<
        RoomsRatingStatisticResponse,
        ErrorState
    >(roomsRatingStatisticUrl(payload));

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
