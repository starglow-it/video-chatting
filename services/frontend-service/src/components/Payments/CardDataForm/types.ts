import { PaymentType } from 'shared-const';

export type CardDataFormProps = {
    isPreEvent: boolean;
    isError: boolean;
    templateId?: string;
    code: string;
    isPaywallPaid?: boolean;
    paymentIntentSecret: string;
    colorForm?: string;
    onSubmit: () => void;
    onError: () => void;
    setMeetingPreviewShow: () => void;
    paymentType: PaymentType;
};
