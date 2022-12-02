import {
	ErrorState 
} from 'shared-types';

import {
	sendRequest 
} from '../../../helpers/http/sendRequest';
import {
	setAuthCookies 
} from '../../../helpers/http/setAuthCookies';
import {
	AuthAdminState,
	LoginAdminPayload,
	LoginAdminResponse,
} from '../../types';
import {
	loginAdminUrl 
} from '../../../const/urls/admin';

export const handleLoginAdmin = async (
	params: LoginAdminPayload,
): Promise<AuthAdminState> => {
	const response = await sendRequest<LoginAdminResponse, ErrorState>({
		...loginAdminUrl,
		data: params,
	});

	if (response.success) {
		setAuthCookies(
			undefined,
			response?.result?.accessToken,
			response?.result?.refreshToken,
		);

		return {
			state: {
				isAuthenticated: response.success,
				admin: response?.result?.admin,
			},
			error: null,
		};
	}

	if (!response.success) {
		return {
			state: {
				isAuthenticated: false,
				admin: null,
			},
			error: response?.error,
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
