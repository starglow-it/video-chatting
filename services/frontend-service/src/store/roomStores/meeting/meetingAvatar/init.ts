import { handleGetAvatars } from './handlers/handleGetAvatars';
import { $avatarsMeetingStore, getAvatarsMeetingFx } from './model';

getAvatarsMeetingFx.use(handleGetAvatars);

$avatarsMeetingStore.on(getAvatarsMeetingFx.doneData, data => data);
