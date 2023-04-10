import { EntityList, IMediaCategory, IUserTemplate } from 'shared-types';
import { meetingDomain } from '../../../domains';
import { IMediaItem } from './types';

export const $isToggleChangeBackground =
    meetingDomain.createStore<boolean>(false);

export const $backgroundMeetingStore = meetingDomain.createStore<{
    medias: IMediaItem[];
    categorySelected: string;
    mediaSelected: string;
    count: number;
    categories: IMediaCategory[];
}>({
    medias: [],
    categorySelected: '',
    mediaSelected: '',
    count: 0,
    categories: [],
});

export const $queryMediasBackgroundStore = meetingDomain.createStore<{
    skip: number;
    limit: number;
}>({ skip: 0, limit: 9 });

export const $isLoadMoreMediasStore = meetingDomain.createStore<boolean>(false);

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
    EntityList<IMediaItem> & { isReset: boolean }
>('getBackgroundMeetingFx');

export const getCategoriesMediasFx = meetingDomain.createEffect<
    void,
    EntityList<IMediaCategory>
>('getCategoriesMediasFx');

export const updateBackgroundMeetingFx = meetingDomain.createEffect<
    { templateId: string; data: Partial<IUserTemplate> },
    void
>('updateBackgroundMeetingFx');

export const setQueryMediasEvent = meetingDomain.createEvent(
    'setQueryMediasEvent',
);
