import { meetingDomain } from '../../../domains';

export const $isToggleChangeBackground =
    meetingDomain.createStore<boolean>(false);

export const $backgroundMeetingStore = meetingDomain.createStore<{
    types: string[];
    images: string[];
    typeSelected: string;
    backgroundSelected: string;
}>({
    types: [],
    images: [],
    typeSelected: '',
    backgroundSelected: '',
});

export const toggleChangeBackgroundEvent = meetingDomain.createEvent(
    'toggleChangeBackgroundEvent',
);

export const setBackgroundEvent = meetingDomain.createEvent<{
    typeSelected?: string;
    backgroundSelected?: string;
}>('setBackgroundEvent');

export const setImagesEvent = meetingDomain.createEvent<{
    types: string[];
    images: string[];
}>('setImagesEvent');

export const getBackgroundMeetingFx = meetingDomain.createEffect<
    { id: string },
    void
>('getBackgroundMeetingFx');
