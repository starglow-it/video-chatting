import { subscriptionsDomain } from '../domain/model';
import { ErrorState } from '../../types';
import {
    GetCheckoutSessionUrlPayload,
    GetCheckoutSessionUrlResponse,
    GetPortalSessionUrlPayload,
    GetPortalSessionUrlResponse,
    ProductsStore,
} from './types';

export const $productsStore = subscriptionsDomain.createStore<ProductsStore>([]);

export const getStripeProductsFx = subscriptionsDomain.createEffect<
    void,
    ProductsStore,
    ErrorState
>('getStripeProductsFx');

export const startCheckoutSessionForSubscriptionFx = subscriptionsDomain.createEffect<
    GetCheckoutSessionUrlPayload,
    GetCheckoutSessionUrlResponse,
    ErrorState
>('startCheckoutSessionForSubscriptionFx');

export const getCustomerPortalSessionUrlFx = subscriptionsDomain.createEffect<
    GetPortalSessionUrlPayload,
    GetPortalSessionUrlResponse,
    ErrorState
>('getCustomerPortalSessionUrlFx');
