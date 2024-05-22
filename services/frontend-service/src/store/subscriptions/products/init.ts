import {
    $productsStore,
    $seatProductsStore,
    getCustomerPortalSessionUrlFx,
    getStripeProductsFx,
    getStripeSeatProductsFx,
    startCheckoutSessionForSubscriptionFx,
} from './model';
import { handleGetStripeProducts } from '../handlers/handleGetStripeProducts';
import { handleGetStripeSeatProducts } from '../handlers/handleGetStripeSeatProducts';
import { handleStartCheckoutSessionForSubscription } from '../handlers/handleStartCheckoutSessionForSubscription';
import { handleGetCustomerPortalSessionUrl } from '../handlers/handleGetCustomerPortalSessionUrl';

getStripeProductsFx.use(handleGetStripeProducts);
getStripeSeatProductsFx.use(handleGetStripeSeatProducts);
startCheckoutSessionForSubscriptionFx.use(
    handleStartCheckoutSessionForSubscription,
);
getCustomerPortalSessionUrlFx.use(handleGetCustomerPortalSessionUrl);

$productsStore.on(getStripeProductsFx.doneData, (state, data) => data);
$seatProductsStore.on(getStripeSeatProductsFx.doneData, (state, data) => data);
