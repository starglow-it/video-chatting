import { attach, Store } from 'effector-next';
import { subscriptionsDomain } from '../domain/model';
import { Profile } from '../../types';
import { $profileStore } from '../../profile/profile/model';
import { GetSubscriptionPayload } from './types';
import {ErrorState} from "shared-types";

export const $subscriptionStore = subscriptionsDomain.createStore<unknown>({});
export const $isTrial = $subscriptionStore.map(subscription => subscription?.status === 'trialing');

export const getSubscriptionFx = subscriptionsDomain.createEffect<
    GetSubscriptionPayload,
    unknown,
    ErrorState
>('getSubscriptionFx');

export const getSubscriptionWithDataFx = attach<GetSubscriptionPayload, Store<Profile>, typeof getSubscriptionFx>({
    effect: getSubscriptionFx,
    source: $profileStore,
    mapParams: (params, profile) => ({ subscriptionId: profile?.stripeSubscriptionId }),
});
