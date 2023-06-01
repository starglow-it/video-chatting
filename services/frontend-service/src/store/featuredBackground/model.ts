import { EntityList, IFeaturedBackground, QueryParams } from 'shared-types';
import { templatesDomain } from '../templates/domain/model';

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
