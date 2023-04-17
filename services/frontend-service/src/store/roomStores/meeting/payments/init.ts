import {
    $isTogglePayment,
    $paymentIntent,
    cancelPaymentIntentFx,
    createPaymentIntentFx,
    createPaymentIntentWithData,
    togglePaymentFormEvent,
} from './model';
import { handleCreatePaymentIntent } from './handlers/handleCreatePaymentIntent';
import { handleCancelPaymentIntent } from './handlers/handleCancelPaymentIntent';

createPaymentIntentFx.use(handleCreatePaymentIntent);
cancelPaymentIntentFx.use(handleCancelPaymentIntent);

$paymentIntent
    .on(createPaymentIntentWithData.doneData, (state, data) => ({
        id: data.id,
        clientSecret: data.clientSecret,
    }))
    .on(cancelPaymentIntentFx.doneData, () => ({
        id: '',
        clientSecret: '',
    }));

$isTogglePayment.on(togglePaymentFormEvent, (toggle, newToggle) =>
    newToggle !== undefined ? newToggle : !toggle,
);
