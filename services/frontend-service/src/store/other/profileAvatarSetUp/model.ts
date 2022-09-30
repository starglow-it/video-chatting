import { otherStoresDomain } from '../../domains';

type UploadProfileAvatar = { file: File | null; dataUrl: string };

const initialProfileAvatarState: UploadProfileAvatar = {
    file: null,
    dataUrl: '',
};

export const $profileAvatarImage =
    otherStoresDomain.createStore<UploadProfileAvatar>(initialProfileAvatarState);

export const setProfileAvatarEvent =
    otherStoresDomain.createEvent<UploadProfileAvatar>('setProfileAvatarEvent');
export const resetProfileAvatarEvent =
    otherStoresDomain.createEvent<void>('resetProfileAvatarEvent');
