import Router from 'next/router';
import {
	$authStore,
	checkAdminAuthFx,
	loginAdminFx,
	logoutAdminFx,
	resetAuthErrorEvent,
	resetAuthStateEvent,
} from './model';

import {
	handleLoginAdmin 
} from './handlers/handleLoginAdmin';
import {
	handleCheckAdminAuthentication 
} from './handlers/handleCheckAdminAuthentication';
import {
	handleLogoutAdmin 
} from './handlers/handleLogoutAdmin';

loginAdminFx.use(handleLoginAdmin);
checkAdminAuthFx.use(handleCheckAdminAuthentication);
logoutAdminFx.use(handleLogoutAdmin);

$authStore
	.on([loginAdminFx.doneData, logoutAdminFx.doneData], (state, data) => data)
	.on(checkAdminAuthFx.doneData, (state, data) => ({
		state: data.state,
		error: null,
	}))
	.on(resetAuthStateEvent, () => ({
		error: null,
		state: {
			isAuthenticated: false,
			admin: null,
		},
	}))
	.on(resetAuthErrorEvent, state => ({
		...state,
		error: null,
	}));

loginAdminFx.doneData.watch(data => {
	if (data.state.isAuthenticated) {
		Router.push('/statistics');
	}
});

logoutAdminFx.doneData.watch(data => {
	if (!data.state.isAuthenticated) {
		Router.push('/');
	}
});
