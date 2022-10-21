import { NextPageContext } from 'next';
import {ErrorState} from "shared-types";

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { AuthAdminState, CheckAdminResponse } from '../../types';
import { adminUrl } from '../../../const/urls/admin';

export const handleCheckAdminAuthentication = async (
    ctx: NextPageContext,
): Promise<AuthAdminState> => {
    // TODO: type admin profile AdminProfile
    const response = await sendRequestWithCredentials<CheckAdminResponse, ErrorState>({
        ...adminUrl,
        ctx,
        authRequest: true,
    });

    if (response.success) {
        return {
            state: {
                isAuthenticated: response.success,
                admin: response?.result,
            },
            error: null,
        };
    }

    if (!response.success) {
        return {
            state: {
                isAuthenticated: response.success,
                admin: null,
            },
            error: response.error,
        };
    }

    return {
        state: {
            isAuthenticated: false,
            admin: null,
        },
        error: null,
    };
};
