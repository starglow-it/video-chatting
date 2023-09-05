import { attach } from 'effector-next';
import { resetRoomStores } from 'src/store/root';
import { handleGetAvatars } from './handlers/handleGetAvatars';
import {
    $avatarsMeetingStore,
    getAvatarsMeetingFx,
    setAvatarTmpEvent,
} from './model';

getAvatarsMeetingFx.use(handleGetAvatars);

$avatarsMeetingStore
    .on(getAvatarsMeetingFx.doneData, (state, data) => ({
        ...state,
        avatar: data,
    }))
    .on(setAvatarTmpEvent, (state, data) => ({ ...state, avatarTmp: data }))
    .reset(resetRoomStores);

export const getAvatarsMeetingEvent = attach({
    effect: getAvatarsMeetingFx,
});
