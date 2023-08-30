import { attach } from 'effector-next';
import { handleGetAvatars } from './handlers/handleGetAvatars';
import { $avatarsMeetingStore, getAvatarsMeetingFx } from './model';

getAvatarsMeetingFx.use(handleGetAvatars);

$avatarsMeetingStore.on(getAvatarsMeetingFx.doneData, (_, data) => ({
    avatar: data,
}));

export const getAvatarsMeetingEvent = attach({
    effect: getAvatarsMeetingFx,
});
