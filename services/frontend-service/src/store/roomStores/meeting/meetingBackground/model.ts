import { EntityList, IMediaCategory, IUserTemplate } from 'shared-types';
import { meetingDomain } from '../../../domains';
import {
    IMediaCategoryItem,
    IMediaItem,
    ParamsDeleteMedia,
    ResultDeleteMedia,
    UploadBackgroundPayload,
} from './types';

export const $backgroundMeetingStore = meetingDomain.createStore<{
    medias: IMediaItem[];
    categorySelected: string;
    mediaSelected: string;
    count: number;
    categories: IMediaCategoryItem[];
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
}>({ skip: 0, limit: 12 });

export const $isLoadMoreMediasStore = meetingDomain.createStore<boolean>(false);

export const $isToggleBackgroundPanel = meetingDomain.createStore(false);

export const setCategoryEvent = meetingDomain.createEvent<{
    categorySelected: string;
}>('setCategoryEvent');

export const setMediaEvent = meetingDomain.createEvent<{
    mediaSelected: string;
}>('setMediaEvent');

export const getBackgroundMeetingFx = meetingDomain.createEffect<
    { id: string; userTemplateId: string },
    EntityList<IMediaItem> & { isReset: boolean }
>('getBackgroundMeetingFx');

export const getCategoriesMediasFx = meetingDomain.createEffect<
    { userTemplateId: string },
    EntityList<IMediaCategory>
>('getCategoriesMediasFx');

export const updateBackgroundMeetingFx = meetingDomain.createEffect<
    { templateId: string; data: Partial<IUserTemplate> },
    void
>('updateBackgroundMeetingFx');

export const setQueryMediasEvent = meetingDomain.createEvent(
    'setQueryMediasEvent',
);

export const uploadNewBackgroundFx = meetingDomain.createEffect<
    UploadBackgroundPayload,
    IMediaItem | null
>('uploadNewBackgroundFx');

export const addBackgroundToCategoryEvent = meetingDomain.createEvent<{
    media: IMediaItem;
}>('addBackgroundToCategoryEvent');

export const reloadMediasEvent = meetingDomain.createEvent('reloadMediasEvent');

export const deleteMediaMeetingFx = meetingDomain.createEffect<
    ParamsDeleteMedia,
    ResultDeleteMedia
>('deleteMediaMeeting');

export const toggleBackgroundManageEvent = meetingDomain.event<
    boolean | undefined
>('toggleBackgroundManageEvent');
