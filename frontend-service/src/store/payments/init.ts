import Router from 'next/router';

import {
    $paymentIntent,
    cancelPaymentIntentFx,
    connectStripeAccountFx,
    createPaymentIntentFx,
    createPaymentIntentWithData,
    deleteStripeAccountFx,
    loginStripeAccountFx,
} from './model';
import { deleteStripeDataEvent } from '../profile/profile/model';

import { handleConnectStripeAccount } from './handlers/handleConnectStripeAccount';
import { handleLoginStripeAccount } from './handlers/handleLoginStripeAccount';
import { handleDeleteStripeAccount } from './handlers/handleDeleteStripeAccount';
import { handleCreatePaymentIntent } from './handlers/handleCreatePaymentIntent';
import { handleCancelPaymentIntent } from './handlers/handleCancelPaymentIntent';
import { addNotificationEvent } from '../notifications/model';
import { NotificationType } from '../types';

connectStripeAccountFx.use(handleConnectStripeAccount);
loginStripeAccountFx.use(handleLoginStripeAccount);
deleteStripeAccountFx.use(handleDeleteStripeAccount);
createPaymentIntentFx.use(handleCreatePaymentIntent);
cancelPaymentIntentFx.use(handleCancelPaymentIntent);

connectStripeAccountFx.doneData.watch(result => {
    if (result?.url) {
        Router.push(result.url);
    }
});

connectStripeAccountFx.fail.watch(() => {
    addNotificationEvent({
        type: NotificationType.PaymentFail,
        message: 'payments.connectAccountFail',
        withErrorIcon: true,
    });
});

loginStripeAccountFx.doneData.watch(result => {
    if (result?.url) {
        window.open(result.url, '_blank');
    }
});

deleteStripeAccountFx.doneData.watch(deleteStripeDataEvent);

$paymentIntent.on(
    [createPaymentIntentWithData.doneData, cancelPaymentIntentFx.doneData],
    (state, data) => ({
        id: data.id,
        clientSecret: data.clientSecret,
    }),
);
