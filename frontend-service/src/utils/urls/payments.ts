import { HttpMethods } from '../../store/types';
import { paymentsScope, serverUrl } from './baseData';

export const connectStripeAccountUrl = {
    url: `${serverUrl}/${paymentsScope}/stripe`,
    method: HttpMethods.Post,
};

export const loginStripeAccountUrl = {
    url: `${serverUrl}/${paymentsScope}/stripe`,
    method: HttpMethods.Get,
};

export const deleteStripeAccountUrl = {
    url: `${serverUrl}/${paymentsScope}/stripe`,
    method: HttpMethods.Delete,
};

export const createIntentUrl = {
    url: `${serverUrl}/${paymentsScope}/createPayment`,
    method: HttpMethods.Post,
};

export const cancelIntentUrl = {
    url: `${serverUrl}/${paymentsScope}/cancelPayment`,
    method: HttpMethods.Post,
};

export const getProductsUrl = {
    url: `${serverUrl}/${paymentsScope}/products`,
    method: HttpMethods.Get,
};

export const getSubscriptionUrl = ({ subscriptionId }: { subscriptionId: string }) => ({
    url: `${serverUrl}/${paymentsScope}/subscriptions/${subscriptionId}`,
    method: HttpMethods.Get,
});

export const startCheckoutSessionUrl = ({ productId, meetingToken }: { productId: string; meetingToken: string }) => ({
    url: `${serverUrl}/${paymentsScope}/products/${productId}/${meetingToken}`,
    method: HttpMethods.Get,
});
