import { forward, sample } from 'effector-next';
import { USER_IS_BLOCKED } from 'shared-const';
import Router from 'next/router';

import { deleteUserAnonymousCookies } from 'src/helpers/http/destroyCookies';
import {
    $authStore,
    checkAuthFx,
    initUserWithoutTokenFx,
    googleVerifyFx,
    loginUserFx,
    logoutUserFx,
    refreshAuthFx,
    resetAuthErrorEvent,
    resetAuthStateEvent,
    setUserCountryFx,
    deleteDraftUsers,
} from './model';
import { clearProfileEvent, setProfileEvent } from '../profile/profile/model';
import { appDialogsApi } from '../dialogs/init';

// handlers
import { handleLoginUser } from './handlers/handleLoginUser';
import { handleCheckUserAuthentication } from './handlers/handleCheckUserAuthentication';
import { handleRefreshUserAuthentication } from './handlers/handleRefreshUserAuthentication';
import { handleLogoutUser } from './handlers/handleLogoutUser';
import { handleSetUserCountry } from './handlers/handleSetUserCountry';

// types
import { AppDialogsEnum } from '../types';

// const
import { clientRoutes } from '../../const/client-routes';
import { handleGoogleVerify } from './handlers/handleGoogleVerify';
import { handleInitUserWithoutToken } from './handlers/handleInitUserWithoutToken';
import { getClientMeetingUrl } from '../../utils/urls';
import { createMeetingFx } from '../meetings/model';
import frontendConfig from '../../const/config';
import { handleDeleteDraftUsers } from './handlers/handleDraftUsers';

loginUserFx.use(handleLoginUser);
checkAuthFx.use(handleCheckUserAuthentication);
refreshAuthFx.use(handleRefreshUserAuthentication);
logoutUserFx.use(handleLogoutUser);
setUserCountryFx.use(handleSetUserCountry);
googleVerifyFx.use(handleGoogleVerify);
initUserWithoutTokenFx.use(handleInitUserWithoutToken);
deleteDraftUsers.use(handleDeleteDraftUsers);

sample({
    clock: loginUserFx.doneData,
    filter: payload => payload.isAuthenticated,
    target: setProfileEvent,
});

forward({
    from: checkAuthFx.doneData,
    to: setProfileEvent,
});

sample({
    clock: loginUserFx.doneData,
    filter: payload => payload.isAuthenticated && !payload?.user?.country,
    target: setUserCountryFx,
});

loginUserFx.doneData.watch(payload => {
    if (payload?.error?.message === USER_IS_BLOCKED.message) {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.userBlockedDialog,
        });
    }
    deleteUserAnonymousCookies();
});

googleVerifyFx.doneData.watch(() => {
    deleteUserAnonymousCookies();
});

logoutUserFx.doneData.watch(() => {
    Router.push(clientRoutes.loginRoute);
    clearProfileEvent();
});

initUserWithoutTokenFx.doneData.watch(
    async ({ user, userTemplateId, subdomain }) => {
        if (!user || !userTemplateId) {
            if (subdomain) window.location.href = frontendConfig.frontendUrl;
            return;
        }
        const { template } = await createMeetingFx({
            templateId: userTemplateId,
            subdomain,
        });
        if (template)
            window.open(getClientMeetingUrl(template?.customLink || template?.id), '_blank');
    },
);

$authStore
    .on(
        [
            loginUserFx.doneData,
            checkAuthFx.doneData,
            logoutUserFx.doneData,
            googleVerifyFx.doneData,
        ],
        (state, data) => data,
    )
    .on(resetAuthStateEvent, () => ({
        isAuthenticated: false,
    }))
    .on(resetAuthErrorEvent, state => ({ ...state, error: null }));
