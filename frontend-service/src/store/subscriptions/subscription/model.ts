import { attach } from 'effector-next';
import { subscriptionsDomain } from '../domain/model';
import { ErrorState } from '../../types';
import { $profileStore } from '../../profile/profile/model';
import { GetSubscriptionPayload } from './types';

export const $subscriptionStore = subscriptionsDomain.createStore<unknown>({});

export const getSubscriptionFx = subscriptionsDomain.createEffect<
    GetSubscriptionPayload,
    unknown,
    ErrorState
>('getSubscriptionFx');

export const getSubscriptionWithDataFx = attach({
    effect: getSubscriptionFx,
    source: $profileStore,
    mapParams: (params, profile) => ({ subscriptionId: profile?.stripeSubscriptionId }),
});
