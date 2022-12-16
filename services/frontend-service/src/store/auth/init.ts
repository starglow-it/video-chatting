import { forward, sample } from 'effector-next';
import {USER_IS_BLOCKED} from "shared-const";
import Router from "next/router";

import {
    $authStore,
    checkAuthFx,
    loginUserFx,
    logoutUserFx, refreshAuthFx,
    resetAuthErrorEvent,
    resetAuthStateEvent,
    setUserCountryFx,
} from './model';
import { clearProfileEvent, setProfileEvent } from '../profile/profile/model';
import {appDialogsApi} from "../dialogs/init";

// handlers
import { handleLoginUser } from './handlers/handleLoginUser';
import { handleCheckUserAuthentication } from './handlers/handleCheckUserAuthentication';
import { handleRefreshUserAuthentication } from './handlers/handleRefreshUserAuthentication';
import { handleLogoutUser } from './handlers/handleLogoutUser';
import { handleSetUserCountry } from './handlers/handleSetUserCountry';

// types
import {AppDialogsEnum} from "../types";

// const
import {clientRoutes} from "../../const/client-routes";

loginUserFx.use(handleLoginUser);
checkAuthFx.use(handleCheckUserAuthentication);
refreshAuthFx.use(handleRefreshUserAuthentication);
logoutUserFx.use(handleLogoutUser);
setUserCountryFx.use(handleSetUserCountry);

sample({
    clock: loginUserFx.doneData,
    filter: (payload) => payload.isAuthenticated,
    target: setProfileEvent,
});

forward({
    from: checkAuthFx.doneData,
    to: setProfileEvent,
});

sample({
    clock: loginUserFx.doneData,
    filter: (payload) => payload.isAuthenticated && !payload?.user?.country,
    target: setUserCountryFx,
});

loginUserFx.doneData.watch((payload) => {
    console.log(payload);
    if (payload?.error?.message === USER_IS_BLOCKED.message)  {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.userBlockedDialog,
        })
    }
});

logoutUserFx.doneData.watch(() => {
    Router.push(clientRoutes.loginRoute)
    clearProfileEvent()
});

$authStore
    .on([
        loginUserFx.doneData,
        checkAuthFx.doneData,
        logoutUserFx.doneData
    ], (state, data) => data)
    .on(resetAuthStateEvent, () => ({
        isAuthenticated: false,
    }))
    .on(resetAuthErrorEvent, state => ({ ...state, error: null }));
