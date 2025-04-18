import { forward, sample } from 'effector-next';
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
    deleteSeatTeamMemberFx,
    removeTeamMemberFromHostFx
} from './model';
import { initialProfileState } from './const';
import { refreshAuthFx, resetAuthStateEvent } from '../../auth/model';
import { deleteStripeAccountFx } from '../../payments/model';

// handlers
import { handleGetProfile } from '../handlers/handleGetProfile';
import { handleUpdateProfileInfo } from '../handlers/handleUpdateProfileInfo';
import { handleDeleteTeamMember } from '../handlers/handleDeleteTeamMember';
import { handleRemoveTeamMemberFromHost } from '../handlers/handleRemoveTeamMemberFromHost';
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
deleteSeatTeamMemberFx.use(handleDeleteTeamMember);
removeTeamMemberFromHostFx.use(handleRemoveTeamMemberFromHost);
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
            deleteProfilePhotoFx.doneData,
            updateProfileEmailFx.doneData,
        ],
        (state, data) => {
            const newProfile = {
                ...state,
                ...data,
            };

            return newProfile
        },
    )
    .on(updateProfileFx.doneData, (state, { profile }) => ({
        ...state,
        ...profile
    }))
    .on(deleteStripeAccountFx.doneData, state => ({
        ...state,
        stripeEmail: '',
        stripeAccountId: '',
        isStripeEnabled: false,
    }));

sample({
    clock: updateProfileEmailFx.doneData,
    target: refreshAuthFx,
});
