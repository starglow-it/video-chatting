import {
    $profileStore,
    clearProfileEvent,
    setProfileEvent,
    updateProfileFx,
    deleteProfilePhotoFx,
    updateProfileEmailFx,
    updateProfilePhotoFx,
    updateProfilePasswordFx,
} from './model';

import { handleUpdateProfileInfo } from '../handlers/handleUpdateProfileInfo';
import { handleUpdateProfilePhoto } from '../handlers/handleUpdateProfilePhoto';
import { handleDeleteProfilePhoto } from '../handlers/handleDeleteProfilePhoto';
import { handleUpdateProfileEmail } from '../handlers/handleUpdateProfileEmail';
import { handleUpdateProfilePassword } from '../handlers/handleUpdateProfilePassword';

import { initialProfileState } from './const';

updateProfileFx.use(handleUpdateProfileInfo);
updateProfilePhotoFx.use(handleUpdateProfilePhoto);
deleteProfilePhotoFx.use(handleDeleteProfilePhoto);
updateProfileEmailFx.use(handleUpdateProfileEmail);
updateProfilePasswordFx.use(handleUpdateProfilePassword);

$profileStore.reset(clearProfileEvent);

$profileStore.on(setProfileEvent, (state, { user }) => {
    if (user) return { ...initialProfileState, ...state, ...user };

    return state;
});

$profileStore.on(
    [
        updateProfilePhotoFx.doneData,
        updateProfileFx.doneData,
        deleteProfilePhotoFx.doneData,
        updateProfileEmailFx.doneData
    ],
    (state, data) => ({
        ...state,
        ...data,
    }),
);
