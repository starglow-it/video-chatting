import {subscriptionsDomain} from "../domain/model";
import {ErrorState} from "../../types";
import {$profileStore} from "../../profile/profile/model";
import { attach } from "effector-next";

export const $subscriptionStore = subscriptionsDomain.createStore({});

export const getSubscriptionFx = subscriptionsDomain.createEffect<{ subscriptionId: string }, any, ErrorState>('getSubscriptionFx');

export const getSubscriptionWithDataFx = attach({
    effect: getSubscriptionFx,
    source: $profileStore,
    mapParams: (params, profile) => ({ subscriptionId: profile?.stripeSubscriptionId })
});