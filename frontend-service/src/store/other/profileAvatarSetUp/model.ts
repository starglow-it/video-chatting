import { otherStoresDomain } from '../domain/model';

type UploadProfileAvatar = { file: File | null; dataUrl: string };

const initialProfileAvatarState: UploadProfileAvatar = {
    file: null,
    dataUrl: '',
};

export const $profileAvatarImage =
    otherStoresDomain.store<UploadProfileAvatar>(initialProfileAvatarState);

export const setProfileAvatar = otherStoresDomain.event<UploadProfileAvatar>('setProfileAvatar');
export const resetProfileAvatarEvent = otherStoresDomain.event('setProfileAvatar');
