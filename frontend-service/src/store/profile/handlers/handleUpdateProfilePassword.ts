import {ErrorState, HttpMethods, Profile} from "../../types";
import sendRequestWithCredentials from "../../../helpers/http/sendRequestWithCredentials";
import {profilePasswordUrl} from "../../../utils/urls/resolveUrl";

export const handleUpdateProfilePassword = async (
    params: { email: string },
): Promise<Profile | ErrorState | null | undefined> => {
    const response = await sendRequestWithCredentials<Profile, ErrorState>(profilePasswordUrl, {
        method: HttpMethods.Post,
        data: params,
    });

    if (response.success) {
        return response.result;
    } else if (!response.success) {
        return response.error;
    }
}