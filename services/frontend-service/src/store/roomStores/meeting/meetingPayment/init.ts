import {
    $enabledPaymentMeetingParticipant,
    $isTogglePayment,
    $meetingPaymentStore,
    $paymentIntent,
    cancelPaymentIntentFx,
    cancelPaymentIntentWithData,
    createPaymentIntentFx,
    createPaymentIntentWithData,
    getPaymentMeetingFx,
    receivePaymentMeetingEvent,
    togglePaymentFormEvent,
    updatePaymentMeetingEvent,
    updatePaymentMeetingFx,
} from './model';
import { handleCreatePaymentIntent } from './handlers/handleCreatePaymentIntent';
import { handleCancelPaymentIntent } from './handlers/handleCancelPaymentIntent';
import { handleUpdatePaymentMeeting } from './handlers/handleUpdatePaymentMeeting';
import { handleGetPaymentMeeting } from './handlers/handleGetPaymentMeeting';
import { sample } from 'effector';
import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';
import { sendUpdatePaymentsMeetingEvent } from '../sockets/model';
import { resetRoomStores } from 'src/store/root';

createPaymentIntentFx.use(handleCreatePaymentIntent);
cancelPaymentIntentFx.use(handleCancelPaymentIntent);
getPaymentMeetingFx.use(handleGetPaymentMeeting);
updatePaymentMeetingFx.use(handleUpdatePaymentMeeting);

$paymentIntent
    .on(createPaymentIntentWithData.doneData, (state, data) => ({
        id: data.id,
        clientSecret: data.clientSecret,
    }))
    .on(cancelPaymentIntentFx.doneData, () => ({
        id: '',
        clientSecret: '',
    }));
$meetingPaymentStore
    .on(getPaymentMeetingFx.doneData, (_, data) => data)
    .on(updatePaymentMeetingFx.doneData, (state, payments) =>
        payments.success ? payments.data : state,
    )
    .on(receivePaymentMeetingEvent, (_, data) => data)
    .reset(resetRoomStores);

$isTogglePayment.on(togglePaymentFormEvent, (toggle, newToggle) =>
    newToggle !== undefined ? newToggle : !toggle,
);

sample({
    clock: [updatePaymentMeetingFx.doneData],
    filter: ({ success }) => !success,
    fn: ({ message }) => ({
        message: message ?? 'Update monetization error',
        withErrorIcon: true,
        type: NotificationType.validationError,
    }),
    target: addNotificationEvent,
});

sample({
    clock: updatePaymentMeetingFx.doneData,
    filter:({data}) => !!data,
    fn: ({data}) => data,
    target: sendUpdatePaymentsMeetingEvent,
});

sample({
    clock: $enabledPaymentMeetingParticipant,
    source: $paymentIntent,
    filter: (payment, enabled) => !enabled && !!payment.id,
    fn: () => undefined,
    target: cancelPaymentIntentWithData,
});
