import { $profileAvatarImage, setProfileAvatar, resetProfileAvatarEvent } from './model';

$profileAvatarImage.on(setProfileAvatar, (state, data) => data);

$profileAvatarImage.reset(resetProfileAvatarEvent);
