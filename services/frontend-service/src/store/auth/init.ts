import { forward, sample } from 'effector-next';

import {
    $authStore,
    checkAuthFx,
    loginUserFx,
    logoutUserFx,
    resetAuthErrorEvent,
    resetAuthStateEvent,
    setUserCountryFx,
} from './model';
import { clearProfileEvent, setProfileEvent } from '../profile/profile/model';

import { handleLoginUser } from './handlers/handleLoginUser';
import { handleCheckUserAuthentication } from './handlers/handleCheckUserAuthentication';
import { handleLogoutUser } from './handlers/handleLogoutUser';
import { handleSetUserCountry } from './handlers/handleSetUserCountry';
import {appDialogsApi} from "../dialogs/init";
import {AppDialogsEnum, DialogActionPayload} from "../types";
import {USER_IS_BLOCKED} from "shared-const";

loginUserFx.use(handleLoginUser);
checkAuthFx.use(handleCheckUserAuthentication);
logoutUserFx.use(handleLogoutUser);
setUserCountryFx.use(handleSetUserCountry);

forward({
    from: loginUserFx.doneData,
    to: setProfileEvent,
});

sample({
    clock: loginUserFx.doneData,
    filter: (state, payload) => !payload?.user?.country,
    target: setUserCountryFx,
});

sample({
    clock: loginUserFx.fail,
    filter: (state, payload) => payload.error?.message === USER_IS_BLOCKED.message,
    fn: (): DialogActionPayload => ({
        dialogKey: AppDialogsEnum.userBlockedDialog,
    }),
    target: appDialogsApi.openDialog,
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
    .on([loginUserFx.doneData, checkAuthFx.doneData, logoutUserFx.doneData], (state, data) => data)
    .on(resetAuthStateEvent, () => ({
        isAuthenticated: false,
    }))
    .on(resetAuthErrorEvent, state => ({ ...state, error: null }));
