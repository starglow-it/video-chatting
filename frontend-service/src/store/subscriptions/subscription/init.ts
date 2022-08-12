import { $subscriptionStore, getSubscriptionFx } from './model';
import { handleGetSubscription } from '../handlers/handleGetSubscription';

getSubscriptionFx.use(handleGetSubscription);

$subscriptionStore.on(getSubscriptionFx.doneData, (state, data) => data);
