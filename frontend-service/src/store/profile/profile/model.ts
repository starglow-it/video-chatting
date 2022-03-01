import { Profile, UpdateProfileAvatar, UpdateProfileInfo } from '../../types';
import { profileDomain } from '../domain';
import { initialProfileState } from './const';

export const setProfileEvent = profileDomain.event<{ user?: Profile }>('setProfileEvent');
export const clearProfileEvent = profileDomain.event('clearProfileEvent');

export const updateProfileFx = profileDomain.effect<
    UpdateProfileInfo,
    Profile | null | undefined,
    void
>('updateProfileFx');

export const updateProfileEmailFx = profileDomain.effect<
    { email: string },
    Profile | null | undefined,
    void
>('updateProfileEmailFx');

export const updateProfilePasswordFx = profileDomain.effect<
    { currentPassword: string, newPassword: string; newPasswordRepeat: string },
    Profile | null | undefined,
    void
>('updateProfilePasswordFx');

export const updateProfilePhotoFx = profileDomain.effect<
    UpdateProfileAvatar,
    Profile | null | undefined,
    void
>('updateProfilePhotoFx');

export const deleteProfilePhotoFx = profileDomain.effect<void, Profile | null | undefined, void>(
    'deleteProfilePhotoFx',
);

export const $profileStore = profileDomain.store<Profile>(initialProfileState);
