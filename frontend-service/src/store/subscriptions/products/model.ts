import {subscriptionsDomain} from "../domain/model";
import {ErrorState} from "../../types";

export const $productsStore = subscriptionsDomain.createStore<{ product: any, price: any }[]>([]);

export const getStripeProductsFx = subscriptionsDomain.createEffect<void, void, void>('getStripeProductsFx');
export const startCheckoutSessionForSubscriptionFx = subscriptionsDomain.createEffect<{ productId: string; meetingToken: string }, { url: string } | undefined, ErrorState>('startCheckoutSessionForSubscriptionFx');
