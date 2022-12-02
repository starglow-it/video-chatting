import {
	parseCookies 
} from 'nookies';
import {
	ErrorState 
} from 'shared-types';

// helpers
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import {
	deleteAuthCookies 
} from '../../../helpers/http/destroyCookies';

// const
import {
	logoutAdminUrl 
} from '../../../const/urls/admin';
import {
	AuthAdminState 
} from '../../types';

export const handleLogoutAdmin = async (): Promise<AuthAdminState> => {
	const {
		refreshToken 
	} = parseCookies();

	await sendRequestWithCredentials<void, ErrorState>({
		...logoutAdminUrl,
		data: {
			token: refreshToken,
		},
	});

	deleteAuthCookies(undefined);

	return {
		state: {
			isAuthenticated: false,
			admin: null,
		},
		error: null,
	};
};
