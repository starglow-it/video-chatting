import { ReactNode } from 'react';
import { PaymentItem } from 'src/store/roomStores/meeting/meetingPayment/type';

export type PaymentFormProps = {
    isPreEvent?: Boolean;
    onClose?: () => void;
    subLabel?: ReactNode;
    payment: PaymentItem;
};
