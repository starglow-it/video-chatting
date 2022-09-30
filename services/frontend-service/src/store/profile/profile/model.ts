import { ErrorState, Profile, UpdateProfileAvatar } from '../../types';
import { initialProfileState } from './const';
import { profileDomain } from '../../domains';
import {
    CheckResetPasswordLinkPayload,
    CheckResetPasswordLinkResponse,
    CommonProfileResponse,
    ResetPasswordPayload,
    SendResetPasswordLinkEmailPayload,
    UpdateProfileEmailPayload,
    UpdateProfilePasswordPayload,
    UpdateProfilePayload,
} from '../types';

export const $profileStore = profileDomain.createStore<Profile>(initialProfileState);

export const $isBusinessSubscription = $profileStore.map(
    profile => profile.subscriptionPlanKey === 'Business',
);
export const $isProfessionalSubscription = $profileStore.map(
    profile => profile.subscriptionPlanKey === 'Professional',
);

export const setProfileEvent = profileDomain.createEvent<{ user?: Profile }>('setProfileEvent');
export const clearProfileEvent = profileDomain.createEvent('clearProfileEvent');

export const getProfileFx = profileDomain.createEffect<void, CommonProfileResponse, void>(
    'getProfileFx',
);

export const updateProfileFx = profileDomain.createEffect<
    UpdateProfilePayload,
    CommonProfileResponse,
    void
>('updateProfileFx');

export const deleteProfileFx = profileDomain.createEffect<void, void, void>('deleteProfileFx');

export const updateProfileEmailFx = profileDomain.createEffect<
    UpdateProfileEmailPayload,
    CommonProfileResponse,
    void
>('updateProfileEmailFx');

export const updateProfilePasswordFx = profileDomain.createEffect<
    UpdateProfilePasswordPayload,
    CommonProfileResponse | ErrorState,
    void
>('updateProfilePasswordFx');

export const updateProfilePhotoFx = profileDomain.createEffect<
    UpdateProfileAvatar,
    CommonProfileResponse,
    void
>('updateProfilePhotoFx');

export const deleteProfilePhotoFx = profileDomain.createEffect<void, CommonProfileResponse, void>(
    'deleteProfilePhotoFx',
);

export const sendResetPasswordLinkFx = profileDomain.createEffect<
    SendResetPasswordLinkEmailPayload,
    void,
    void
>('sendResetPasswordLinkFx');

export const checkResetPasswordLinkFx = profileDomain.createEffect<
    CheckResetPasswordLinkPayload,
    CheckResetPasswordLinkResponse,
    void
>('checkResetPasswordLinkFx');

export const resetPasswordFx = profileDomain.createEffect<
    ResetPasswordPayload,
    ErrorState | null | undefined,
    void
>('resetPasswordFx');
