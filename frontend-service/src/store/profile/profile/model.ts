import { ErrorState, Profile, UpdateProfileAvatar, UpdateProfileInfo } from '../../types';
import { profileDomain } from '../domain/model';
import { initialProfileState } from './const';

export const $profileStore = profileDomain.store<Profile>(initialProfileState);

export const setProfileEvent = profileDomain.event<{ user?: Profile }>('setProfileEvent');
export const clearProfileEvent = profileDomain.event('clearProfileEvent');
export const deleteStripeDataEvent = profileDomain.event('deleteStripeDataEvent');

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
    { currentPassword: string; newPassword: string; newPasswordRepeat: string },
    Profile | ErrorState | null | undefined,
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

export const sendResetPasswordLinkFx = profileDomain.effect<{ email: string }, void, void>(
    'sendResetPasswordLinkFx',
);

export const checkResetPasswordLinkFx = profileDomain.effect<{ token: string }, { isUserConfirmed: boolean; error?: ErrorState }, void>(
    'checkResetPasswordLinkFx',
);

export const resetPasswordFx = profileDomain.effect<{ newPassword: string; newPasswordRepeat: string }, ErrorState | null | undefined, void>(
    'resetPasswordFx',
);

