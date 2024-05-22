import { PaymentItem } from 'src/store/roomStores/meeting/meetingPayment/type';

export type PaymentFormProps = {
    isPaywallPaid: boolean;
    payment: PaymentItem;
    subLabel: string;
    setMeetingPreviewShow: () => void;
    onClose: () => void;
};
