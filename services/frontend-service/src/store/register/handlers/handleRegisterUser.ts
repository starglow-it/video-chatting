import { ErrorState, HttpMethods } from 'shared-types';
import { sendRequest } from '../../../helpers/http/sendRequest';
import { RegisterUserParams } from '../../types';
import frontendConfig from '../../../const/config';
import { authApiMethods } from "../../../utils/urls";

export const handleRegisterUser = async (params: RegisterUserParams) => {
    const userData = await sendRequest<{ country_name: string }, ErrorState>({
        url: `https://api.ipgeolocation.io/ipgeo?apiKey=${frontendConfig.geolocationApiKey}`,
        method: HttpMethods.Get,
    });

    const registerUserUrl = authApiMethods.registerUserUrl();

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

    if (!response.success) {
        throw new Error(response?.error?.message)
    }

    return {
        isUserRegistered: false,
        error: null,
    };
};
