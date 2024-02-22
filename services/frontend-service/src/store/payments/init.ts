import Router from 'next/router';

import {
    connectStripeAccountFx,
    deleteStripeAccountFx,
    loginStripeAccountFx,
} from './model';

import { handleConnectStripeAccount } from './handlers/handleConnectStripeAccount';
import { handleLoginStripeAccount } from './handlers/handleLoginStripeAccount';
import { handleDeleteStripeAccount } from './handlers/handleDeleteStripeAccount';
import { addNotificationEvent } from '../notifications/model';
import { NotificationType } from '../types';

connectStripeAccountFx.use(handleConnectStripeAccount);
loginStripeAccountFx.use(handleLoginStripeAccount);
deleteStripeAccountFx.use(handleDeleteStripeAccount);

connectStripeAccountFx.doneData.watch(result => {
    if (result?.url) {
        window.open(result.url, '_blank');
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
