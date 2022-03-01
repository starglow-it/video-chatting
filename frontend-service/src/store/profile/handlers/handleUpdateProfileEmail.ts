import sendRequestWithCredentials from "../../../helpers/http/sendRequestWithCredentials";
import { ErrorState, HttpMethods, Profile } from "../../types";
import {profileEmailUrl} from "../../../utils/urls/resolveUrl";

export const handleUpdateProfileEmail = async (
    params: { email: string },
): Promise<Profile | null | undefined> => {
    const response = await sendRequestWithCredentials<Profile, ErrorState>(profileEmailUrl, {
        method: HttpMethods.Post,
        data: params,
    });

    if (response.success) {
        return response.result;
    } else if (!response.success) {
        return response.result;
    }
}