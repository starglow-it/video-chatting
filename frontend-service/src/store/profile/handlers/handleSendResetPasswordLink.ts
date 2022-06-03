import sendRequestWithCredentials from "../../../helpers/http/sendRequestWithCredentials";
import {ErrorState, Profile} from "../../types";
import { sendResetPasswordLinkUrl } from "../../../utils/urls";

export const handleSendResetPasswordLink = async (params: { email: string }): Promise<void> => {
    await sendRequestWithCredentials<Profile, ErrorState>({
        ...sendResetPasswordLinkUrl,
        data: params,
    });

    return;
}