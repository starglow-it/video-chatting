import {
    $productsStore,
    $seatProductsStore,
    getCustomerPortalSessionUrlFx,
    getCustomerSeatPortalSessionUrlFx,
    getStripeProductsFx,
    getStripeSeatProductsFx,
    startCheckoutSessionForSubscriptionFx,
    startCheckoutSessionForSeatSubscriptionFx,
} from './model';
import { handleGetStripeProducts } from '../handlers/handleGetStripeProducts';
import { handleGetStripeSeatProducts } from '../handlers/handleGetStripeSeatProducts';
import { handleStartCheckoutSessionForSeatSubscription } from '../handlers/handleStartCheckoutSessionForSeatSubscription';
import { handleStartCheckoutSessionForSubscription } from '../handlers/handleStartCheckoutSessionForSubscription';
import { handleGetCustomerSeatPortalSessionUrl } from '../handlers/handleGetCustomerSeatPortalSessionUrl';
import { handleGetCustomerPortalSessionUrl } from '../handlers/handleGetCustomerPortalSessionUrl';

getStripeProductsFx.use(handleGetStripeProducts);
getStripeSeatProductsFx.use(handleGetStripeSeatProducts);
startCheckoutSessionForSubscriptionFx.use(
    handleStartCheckoutSessionForSubscription,
);
startCheckoutSessionForSeatSubscriptionFx.use(
    handleStartCheckoutSessionForSeatSubscription,
);
getCustomerPortalSessionUrlFx.use(handleGetCustomerPortalSessionUrl);
getCustomerSeatPortalSessionUrlFx.use(handleGetCustomerSeatPortalSessionUrl);

$productsStore.on(getStripeProductsFx.doneData, (state, data) => data);
$seatProductsStore.on(getStripeSeatProductsFx.doneData, (state, data) => data);
