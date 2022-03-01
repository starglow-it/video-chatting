import { otherStoresDomain } from '../domain';

type UploadProfileAvatar = { file: File | null; dataUrl: string | null };

const initialProfileAvatarState: UploadProfileAvatar = {
    file: null,
    dataUrl: null,
};

export const $profileAvatarImage =
    otherStoresDomain.store<UploadProfileAvatar>(initialProfileAvatarState);

export const setProfileAvatar = otherStoresDomain.event<UploadProfileAvatar>('setProfileAvatar');
export const resetProfileAvatarEvent = otherStoresDomain.event('setProfileAvatar');
