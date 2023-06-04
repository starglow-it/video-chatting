import { EntityList, IFeaturedBackground, QueryParams } from 'shared-types';
import { templatesDomain } from '../domains';

export const $featuredBackgroundStore = templatesDomain.createStore<
    EntityList<IFeaturedBackground>
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
