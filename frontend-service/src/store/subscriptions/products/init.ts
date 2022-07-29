import {$productsStore, getStripeProductsFx, startCheckoutSessionForSubscriptionFx} from "./model";
import {handleGetStripeProducts} from "../handlers/handleGetStripeProducts";
import {handleStartCheckoutSessionForSubscription} from "../handlers/handleStartCheckoutSessionForSubscription";

getStripeProductsFx.use(handleGetStripeProducts);
startCheckoutSessionForSubscriptionFx.use(handleStartCheckoutSessionForSubscription);

$productsStore.on(getStripeProductsFx.doneData, (state, data) => {
    return data;
});
