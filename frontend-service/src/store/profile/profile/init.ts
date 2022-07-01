import {
    $profileStore,
    clearProfileEvent,
    setProfileEvent,
    updateProfileFx,
    deleteProfilePhotoFx,
    updateProfileEmailFx,
    updateProfilePhotoFx,
    updateProfilePasswordFx,
    sendResetPasswordLinkFx,
    checkResetPasswordLinkFx,
    resetPasswordFx,
    deleteStripeDataEvent,
} from './model';

import { handleUpdateProfileInfo } from '../handlers/handleUpdateProfileInfo';
import { handleUpdateProfilePhoto } from '../handlers/handleUpdateProfilePhoto';
import { handleDeleteProfilePhoto } from '../handlers/handleDeleteProfilePhoto';
import { handleUpdateProfileEmail } from '../handlers/handleUpdateProfileEmail';
import { handleUpdateProfilePassword } from '../handlers/handleUpdateProfilePassword';
import { handleSendResetPasswordLink } from '../handlers/handleSendResetPasswordLink';
import { handleCheckResetPasswordLink } from '../handlers/handleCheckResetPasswordLink';
import { handleResetPassword } from '../handlers/handleResetPassword';

import { initialProfileState } from './const';

updateProfileFx.use(handleUpdateProfileInfo);
updateProfilePhotoFx.use(handleUpdateProfilePhoto);
deleteProfilePhotoFx.use(handleDeleteProfilePhoto);
updateProfileEmailFx.use(handleUpdateProfileEmail);
updateProfilePasswordFx.use(handleUpdateProfilePassword);
sendResetPasswordLinkFx.use(handleSendResetPasswordLink);
checkResetPasswordLinkFx.use(handleCheckResetPasswordLink);
resetPasswordFx.use(handleResetPassword);

$profileStore.reset(clearProfileEvent);

$profileStore
    .on(setProfileEvent, (state, { user }) => {
        if (user) return { ...initialProfileState, ...state, ...user };

        return state;
    })
    .on(
        [
            updateProfilePhotoFx.doneData,
            updateProfileFx.doneData,
            deleteProfilePhotoFx.doneData,
            updateProfileEmailFx.doneData,
        ],
        (state, data) => ({
            ...state,
            ...data,
        }),
    )
    .on(deleteStripeDataEvent, (state) => ({ ...state, stripeEmail: "", stripeAccountId: "" }));
