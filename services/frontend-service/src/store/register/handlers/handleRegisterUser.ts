import { ErrorState, HttpMethods } from 'shared-types';
import { sendRequest } from '../../../helpers/http/sendRequest';
import { RegisterUserParams } from '../../types';
import { registerUserUrl } from '../../../utils/urls';
import frontendConfig from '../../../const/config';

export const handleRegisterUser = async (params: RegisterUserParams) => {
    const userData = await sendRequest<{ country_name: string }, ErrorState>({
        url: `https://api.ipgeolocation.io/ipgeo?apiKey=${frontendConfig.geolocationApiKey}`,
        method: HttpMethods.Get,
    });

    console.log(userData);

    const response = await sendRequest<void, ErrorState>({
        ...registerUserUrl,
        data: {
            ...params,
            country: userData?.result?.country_name,
        },
    });

    if (response.success) {
        return {
            isUserRegistered: response.success,
        };
    }
    return {
        isUserRegistered: response.success,
        error: response.error,
    };
};
