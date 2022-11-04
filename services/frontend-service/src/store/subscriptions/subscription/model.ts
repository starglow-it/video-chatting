import { attach, Store } from 'effector-next';
import { subscriptionsDomain } from '../domain/model';
import { ErrorState, Profile } from '../../types';
import { $profileStore } from '../../profile/profile/model';
import { GetSubscriptionPayload } from './types';

export const $subscriptionStore = subscriptionsDomain.createStore<unknown>({});
export const $isTrial = $subscriptionStore.map(subscription => subscription.status === 'trialing');

export const getSubscriptionFx = subscriptionsDomain.createEffect<
    GetSubscriptionPayload,
    unknown,
    ErrorState
>('getSubscriptionFx');

export const getSubscriptionWithDataFx = attach<void, Store<Profile>, typeof getSubscriptionFx>({
    effect: getSubscriptionFx,
    source: $profileStore,
    mapParams: (params, profile) => ({ subscriptionId: profile?.stripeSubscriptionId }),
});
