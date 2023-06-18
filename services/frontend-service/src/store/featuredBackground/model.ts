import { EntityList, ICommonTemplate, QueryParams } from 'shared-types';
import { templatesDomain } from '../templates/domain/model';

export const $featuredBackgroundStore = templatesDomain.createStore<
    EntityList<ICommonTemplate>
>({
    list: [],
    count: 0,
});

export const getFeaturedBackgroundFx = templatesDomain.createEffect<
    QueryParams,
    EntityList<ICommonTemplate>
>('getFeaturedBackground');
