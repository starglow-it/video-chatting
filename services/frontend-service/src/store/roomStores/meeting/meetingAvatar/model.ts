import { EntityList, IMeetingAvatar } from 'shared-types';
import { meetingDomain } from 'src/store/domains';

export const $avatarsMeetingStore = meetingDomain.createStore<{
    avatar: EntityList<IMeetingAvatar>;
    avatarTmp: string;
}>({
    avatar: {
        list: [],
        count: 0,
    },
    avatarTmp: '',
});

export const getAvatarsMeetingFx = meetingDomain.createEffect<
    void,
    EntityList<IMeetingAvatar>
>('getAvatarsMeetingFx');

export const setAvatarTmpEvent =
    meetingDomain.createEvent<string>('setAvatarTmpEvent');
