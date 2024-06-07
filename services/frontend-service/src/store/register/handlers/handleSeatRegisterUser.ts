import { ErrorState, HttpMethods } from 'shared-types';
import { sendRequest } from '../../../helpers/http/sendRequest';
import { SeatRegisterUserParams } from '../../types';
import { seatRegisterUserUrl } from '../../../utils/urls';
import frontendConfig from '../../../const/config';

export const handleSeatRegisterUser = async (params: SeatRegisterUserParams) => {
    const userData = await sendRequest<{ country_name: string, state_prov: string }, ErrorState>({
        url: `https://api.ipgeolocation.io/ipgeo?apiKey=${frontendConfig.geolocationApiKey}`,
        method: HttpMethods.Get,
    });

    const response = await sendRequest<void, ErrorState>({
        ...seatRegisterUserUrl,
        data: {
            ...params,
            country: userData?.result?.country_name,
            state: userData?.result?.state_prov
        },
    });

    if (response.success) {
        return {
            isUserRegistered: response.success,
        };
    }

    return {
        isUserRegistered: false,
        error: null,
    };
};
