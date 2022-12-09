import {sendRequest} from "../../../helpers/http/sendRequest";
import {LoginUserResponse} from "../../types";
import {ErrorState} from "shared-types";
import { refreshUrl } from "../../../utils/urls";
import setAuthCookies from "../../../helpers/http/setAuthCookies";
import {parseCookies} from "nookies";

export const handleRefreshUserAuthentication = async () => {
    const { refreshToken } = parseCookies();

    const response = await sendRequest<LoginUserResponse, ErrorState>({
        ...refreshUrl,
        data: {
            token: refreshToken
        }
    });

    if (response.success) {
        setAuthCookies(undefined, response?.result?.accessToken, response?.result?.refreshToken);

        return {
            isAuthenticated: response.success,
            user: response?.result?.user,
        };
    }

    if (!response.success) {
        return {
            isAuthenticated: false,
            error: response?.error,
        };
    }

    return {
        isAuthenticated: false,
    };
}