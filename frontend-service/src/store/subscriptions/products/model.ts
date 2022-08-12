import { subscriptionsDomain } from '../domain/model';
import { ErrorState } from '../../types';

export const $productsStore = subscriptionsDomain.createStore<{ product: any; price: any }[]>([]);

export const getStripeProductsFx = subscriptionsDomain.createEffect<void, void, void>(
    'getStripeProductsFx',
);
export const startCheckoutSessionForSubscriptionFx = subscriptionsDomain.createEffect<
    { productId: string; meetingToken?: string; baseUrl: string },
    { url: string } | undefined,
    ErrorState
>('startCheckoutSessionForSubscriptionFx');
export const getCustomerPortalSessionUrlFx = subscriptionsDomain.createEffect<
    { subscriptionId: string },
    { url: string } | undefined,
    ErrorState
>('getCustomerPortalSessionUrlFx');
