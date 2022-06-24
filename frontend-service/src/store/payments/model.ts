import {attach, combine } from "effector-next";

import { root } from "../root";
import {$meetingTemplateStore} from "../meeting/meetingTemplate/model";

const paymentsDomain = root.createDomain();

export const $paymentIntent = paymentsDomain.store({
    id: "",
    clientSecret: ''
});

export const connectStripeAccountFx = paymentsDomain.effect<any, { url: string } | undefined, any>('connectStripeAccount');
export const loginStripeAccountFx = paymentsDomain.effect<any, { url: string } | undefined, any>('loginStripeAccountFx');
export const deleteStripeAccountFx = paymentsDomain.effect<any, any, any>('deleteStripeAccountFx');

export const createPaymentIntentFx = paymentsDomain.effect('createPaymentIntentFx');
export const cancelPaymentIntentFx = paymentsDomain.effect('cancelPaymentIntentFx');

export const createPaymentIntentWithData = attach({
    effect: createPaymentIntentFx,
    source: combine({ meetingTemplate: $meetingTemplateStore }),
    mapParams: (params, { meetingTemplate }) => ({
        templateId: meetingTemplate.id,
    })
});

export const cancelPaymentIntentWithData = attach({
    effect: cancelPaymentIntentFx,
    source: combine({ paymentIntent: $paymentIntent }),
    mapParams: (params, { paymentIntent }) => ({
        paymentIntentId: paymentIntent.id,
    })
});