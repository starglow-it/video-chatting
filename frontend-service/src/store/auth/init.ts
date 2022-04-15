import { forward } from 'effector-next';

import { $authStore, checkAuthFx, loginUserFx, logoutUserFx, resetAuthErrorEvent } from './model';
import { clearProfileEvent, setProfileEvent } from '../profile';

import {handleLoginUser} from "./handlers/handleLoginUser";
import {handleCheckUserAuthentication} from "./handlers/handleCheckUserAuthentication";
import {handleLogoutUser} from "./handlers/handleLogoutUser";

loginUserFx.use(handleLoginUser);
checkAuthFx.use(handleCheckUserAuthentication);
logoutUserFx.use(handleLogoutUser);

forward({
    from: loginUserFx.doneData,
    to: setProfileEvent,
});

forward({
    from: checkAuthFx.doneData,
    to: setProfileEvent,
});

forward({
    from: logoutUserFx.doneData,
    to: clearProfileEvent,
});

$authStore
    .on(loginUserFx.doneData, (state, data) => data)
    .on(checkAuthFx.doneData, (state, data) => data)
    .on(logoutUserFx.doneData, (state, data) => data)
    .on(resetAuthErrorEvent, ({ error, ...rest }) => ({ ...rest }));
