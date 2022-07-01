import {sendRequest} from "../../../helpers/http/sendRequest";
import {ErrorState} from "../../types";
import {registerUserUrl} from "../../../utils/urls";

export const handleRegisterUser = async params => {
    const response = await sendRequest<void, ErrorState>({
        ...registerUserUrl,
        data: params,
    });

    if (response.success) {
        return {
            isUserRegistered: response.success,
        };
    } else {
        return {
            isUserRegistered: response.success,
            error: response.error,
        };
    }
}