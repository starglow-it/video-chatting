import {
    $productsStore,
    getCustomerPortalSessionUrlFx,
    getStripeProductsFx,
    startCheckoutSessionForSubscriptionFx,
} from './model';
import { handleGetStripeProducts } from '../handlers/handleGetStripeProducts';
import { handleStartCheckoutSessionForSubscription } from '../handlers/handleStartCheckoutSessionForSubscription';
import { handleGetCustomerPortalSessionUrl } from '../handlers/handleGetCustomerPortalSessionUrl';

getStripeProductsFx.use(handleGetStripeProducts);
startCheckoutSessionForSubscriptionFx.use(handleStartCheckoutSessionForSubscription);
getCustomerPortalSessionUrlFx.use(handleGetCustomerPortalSessionUrl);

$productsStore.on(getStripeProductsFx.doneData, (state, data) => data);
