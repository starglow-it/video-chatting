import {
    EntityList,
    ICommonTemplate,
    IFeaturedBackground,
    QueryParams,
    RoomType,
} from 'shared-types';
import { templatesDomain } from '../domains';
import { CommonTemplatesListState } from '../types';

export const $featuredBackgroundStore = templatesDomain.createStore<
    EntityList<ICommonTemplate>
>({
    list: [],
    count: 0,
});

export const getFeaturedBackgroundFx = templatesDomain.createEffect<
    QueryParams,
    EntityList<IFeaturedBackground>
>('getFeaturedBackground');

export const createFeaturedBackgroundFx = templatesDomain.createEffect<
    File,
    void
>('createFeaturedBackgroundFx');

export const deleteFeaturedBackground = templatesDomain.createEffect<
    string,
    void
>('deleteFeaturedBackground');

export const getFeaturedTemplatesFx = templatesDomain.createEffect<
    QueryParams & { roomType: RoomType; draft?: boolean },
    CommonTemplatesListState,
    void
>('getFeaturedTemplatesFx');
