import { HttpMethods } from '../../store/types';
import {
    paymentsScope,
    profileScope,
    serverUrl,
    templatesScope,
} from './baseData';

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

export const createIntentUrlForRecordingVideo = {
    url: `${serverUrl}/${paymentsScope}/createPaymentForRecordingVideo`,
    method: HttpMethods.Post,
};

export const isRoomPaywalledUrl = {
    url: `${serverUrl}/${paymentsScope}/isRoomPaywalled`,
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

export const getSeatProductsUrl = {
    url: `${serverUrl}/${paymentsScope}/seat-products`,
    method: HttpMethods.Get,
};

export const getCustomerPortalSessionUrl = ({
    subscriptionId,
}: {
    subscriptionId: string;
}) => ({
    url: `${serverUrl}/${paymentsScope}/portal/${subscriptionId}`,
    method: HttpMethods.Get,
});

export const getSubscriptionUrl = ({
    subscriptionId,
}: {
    subscriptionId: string;
}) => ({
    url: `${serverUrl}/${paymentsScope}/subscriptions/${subscriptionId}`,
    method: HttpMethods.Get,
});

export const startCheckoutSessionUrl = ({
    productId,
}: {
    productId: string;
}) => ({
    url: `${serverUrl}/${paymentsScope}/products/${productId}`,
    method: HttpMethods.Post,
});

export const purchaseTemplateUrl = ({
    templateId,
}: {
    templateId: string;
}) => ({
    url: `${serverUrl}/${paymentsScope}/templates/${templateId}`,
    method: HttpMethods.Get,
});

export const getMonetizationTemplateUrl = (templateId: string) => ({
    url: `${serverUrl}/${profileScope}/${templatesScope}/${templateId}/payments`,
    method: HttpMethods.Get,
});

export const updateMonetizationTemplateUrl = (templateId: string) => ({
    url: `${serverUrl}/${profileScope}/${templatesScope}/${templateId}/payment`,
    method: HttpMethods.Patch,
});
