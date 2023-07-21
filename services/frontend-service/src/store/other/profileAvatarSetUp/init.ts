import {
    $profileAvatarImage,
    setProfileAvatarEvent,
    resetProfileAvatarEvent,
} from './model';

$profileAvatarImage.on(setProfileAvatarEvent, (state, data) => data);

$profileAvatarImage.reset(resetProfileAvatarEvent);
