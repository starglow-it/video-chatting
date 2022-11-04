import { sendRequest } from '../../../helpers/http/sendRequest';
import { ErrorState, HttpMethods } from '../../types';
import { updateProfileFx } from '../../profile/profile/model';
import frontendConfig from '../../../const/config';

export const handleSetUserCountry = async (): Promise<void> => {
    const userData = await sendRequest<{ country_name: string }, ErrorState>({
        url: `https://api.ipgeolocation.io/ipgeo?apiKey=${frontendConfig.geolocationApiKey}`,
        method: HttpMethods.Get,
    });

    updateProfileFx({
        country: userData.result?.country_name,
    });

    return;
};
