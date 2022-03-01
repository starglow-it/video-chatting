import { $profileAvatarImage, setProfileAvatar, resetProfileAvatarEvent } from './model';

$profileAvatarImage.on(setProfileAvatar, (state, data) => {
    return data;
});

$profileAvatarImage.reset(resetProfileAvatarEvent);
