import { NextPageContext } from 'next';
import { subscriptionsDomain } from '../domain/model';
import { ErrorState, INextPageContext } from '../../types';
import {
    GetCheckoutSessionUrlPayload,
    GetCheckoutSessionUrlResponse,
    GetPortalSessionUrlPayload,
    GetPortalSessionUrlResponse,
    ProductsStore,
} from './types';

export const $productsStore = subscriptionsDomain.createStore<ProductsStore>(
    [],
);

export const $seatProductsStore = subscriptionsDomain.createStore<ProductsStore>(
    [],
);

export const getStripeProductsFx = subscriptionsDomain.createEffect<
    Partial<INextPageContext>,
    ProductsStore,
    ErrorState
>('getStripeProductsFx');

export const getStripeSeatProductsFx = subscriptionsDomain.createEffect<
    Partial<INextPageContext>,
    ProductsStore,
    ErrorState
>('getStripeProductsFx');

export const getStripeProductsWithContextFx = subscriptionsDomain.createEffect<
    NextPageContext,
    ProductsStore,
    ErrorState
>('getStripeProductsWithContextFx');

export const startCheckoutSessionForSubscriptionFx =
    subscriptionsDomain.createEffect<
        GetCheckoutSessionUrlPayload,
        GetCheckoutSessionUrlResponse,
        ErrorState
    >('startCheckoutSessionForSubscriptionFx');

export const startCheckoutSessionForSeatSubscriptionFx =
    subscriptionsDomain.createEffect<
        GetCheckoutSessionUrlPayload,
        GetCheckoutSessionUrlResponse,
        ErrorState
    >('startCheckoutSessionForSubscriptionFx');

export const getCustomerPortalSessionUrlFx = subscriptionsDomain.createEffect<
    GetPortalSessionUrlPayload,
    GetPortalSessionUrlResponse,
    ErrorState
>('getCustomerPortalSessionUrlFx');

export const getCustomerSeatPortalSessionUrlFx = subscriptionsDomain.createEffect<
    GetPortalSessionUrlPayload,
    GetPortalSessionUrlResponse,
    ErrorState
>('getCustomerPortalSessionUrlFx');
