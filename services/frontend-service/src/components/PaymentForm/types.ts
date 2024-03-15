import { PaymentItem } from 'src/store/roomStores/meeting/meetingPayment/type';

export type PaymentFormProps = {
    isPaywallPaid: boolean;
    payment: PaymentItem;
    setMeetingPreviewShow: () => void;
};
