import { meetingDomain } from '../../../domains';
import { ICategoryMedia } from './types';

export const $isToggleChangeBackground =
    meetingDomain.createStore<boolean>(false);

export const $backgroundMeetingStore = meetingDomain.createStore<{
    medias: ICategoryMedia[];
    categorySelected: string;
    mediaSelected: string;
}>({
    medias: [],
    categorySelected: '',
    mediaSelected: '',
});

export const toggleChangeBackgroundEvent = meetingDomain.createEvent(
    'toggleChangeBackgroundEvent',
);

export const setCategoryEvent = meetingDomain.createEvent<{
    categorySelected: string;
}>('setCategoryEvent');

export const setMediaEvent = meetingDomain.createEvent<{
    mediaSelected: string;
}>('setMediaEvent');

export const getBackgroundMeetingFx = meetingDomain.createEffect<
    { id: string },
    ICategoryMedia[]
>('getBackgroundMeetingFx');

export const updateBackgroundMeetingFx = meetingDomain.createEffect<
    { templateId: string; data: any },
    void
>('updateBackgroundMeetingFx');
