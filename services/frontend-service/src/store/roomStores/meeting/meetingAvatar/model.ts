import { meetingDomain } from 'src/store/domains';

export const $avatarsMeetingStore = meetingDomain.createStore<{
    avatars: any[];
}>({
    avatars: [],
});

export const getAvatarsMeetingFx = meetingDomain.createEffect<void, void>(
    'getAvatarsMeetingFx',
);

