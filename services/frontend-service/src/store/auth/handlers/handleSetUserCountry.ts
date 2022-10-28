import {sendRequest} from "../../../helpers/http/sendRequest";
import {ErrorState, HttpMethods} from "../../types";
import {updateProfileFx} from "../../profile/profile/model";

export const handleSetUserCountry = async (): Promise<void> => {
    const userData = await sendRequest<{ country: string }, ErrorState>({
        url: 'http://ip-api.com/json',
        method: HttpMethods.Get,
    });

    updateProfileFx({
        country: userData.result?.country,
    });

    return;
}