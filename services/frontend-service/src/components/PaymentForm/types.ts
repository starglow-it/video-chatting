import { ReactNode } from 'react';

export type PaymentFormProps = {
    onClose?: () => void;
    templateType?: string;
    subLabel?: ReactNode;
    paymentType?: 'in-meeting' | 'paywall';
};
