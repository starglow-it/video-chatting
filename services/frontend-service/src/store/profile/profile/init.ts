import { forward } from 'effector-next';
import {
    $profileStore,
    clearProfileEvent,
    setProfileEvent,
    getProfileFx,
    updateProfileFx,
    deleteProfilePhotoFx,
    updateProfileEmailFx,
    updateProfilePhotoFx,
    updateProfilePasswordFx,
    sendResetPasswordLinkFx,
    checkResetPasswordLinkFx,
    resetPasswordFx,
    deleteProfileFx,
} from './model';
import { initialProfileState } from './const';
import { resetAuthStateEvent } from '../../auth/model';
import { deleteStripeAccountFx } from '../../payments/model';

// handlers
import { handleGetProfile } from '../handlers/handleGetProfile';
import { handleUpdateProfileInfo } from '../handlers/handleUpdateProfileInfo';
import { handleUpdateProfilePhoto } from '../handlers/handleUpdateProfilePhoto';
import { handleDeleteProfilePhoto } from '../handlers/handleDeleteProfilePhoto';
import { handleUpdateProfileEmail } from '../handlers/handleUpdateProfileEmail';
import { handleUpdateProfilePassword } from '../handlers/handleUpdateProfilePassword';
import { handleSendResetPasswordLink } from '../handlers/handleSendResetPasswordLink';
import { handleCheckResetPasswordLink } from '../handlers/handleCheckResetPasswordLink';
import { handleResetPassword } from '../handlers/handleResetPassword';
import { handleDeleteProfile } from '../handlers/handleDeleteProfile';

getProfileFx.use(handleGetProfile);
updateProfileFx.use(handleUpdateProfileInfo);
updateProfilePhotoFx.use(handleUpdateProfilePhoto);
deleteProfilePhotoFx.use(handleDeleteProfilePhoto);
updateProfileEmailFx.use(handleUpdateProfileEmail);
updateProfilePasswordFx.use(handleUpdateProfilePassword);
sendResetPasswordLinkFx.use(handleSendResetPasswordLink);
checkResetPasswordLinkFx.use(handleCheckResetPasswordLink);
resetPasswordFx.use(handleResetPassword);
deleteProfileFx.use(handleDeleteProfile);

$profileStore.reset(clearProfileEvent);

forward({
    from: deleteProfileFx.doneData,
    to: resetAuthStateEvent,
});

$profileStore
    .on(setProfileEvent, (state, { user }) => {
        if (user) {
            return {
                ...initialProfileState,
                ...state,
                ...user,
            };
        }

        return state;
    })
    .on(
        [
            getProfileFx.doneData,
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
    .on(deleteStripeAccountFx.doneData, state => ({
        ...state,
        stripeEmail: '',
        stripeAccountId: '',
        isStripeEnabled: false,
    }));
