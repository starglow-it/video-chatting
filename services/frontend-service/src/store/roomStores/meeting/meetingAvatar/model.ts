import { EntityList, IMeetingAvatar } from 'shared-types';
import { meetingDomain } from 'src/store/domains';

export const $avatarsMeetingStore = meetingDomain.createStore<{
    avatar: EntityList<IMeetingAvatar>;
}>({
    avatar: {
        list: [],
        count: 0,
    },
});

export const getAvatarsMeetingFx = meetingDomain.createEffect<
    void,
    EntityList<IMeetingAvatar>
>('getAvatarsMeetingFx');
