import { PaymentType } from 'shared-const';

export type CardDataFormProps = {
    paymentIntentSecret: string;
    colorForm?: string;
    onSubmit: () => void;
    onError: () => void;
    paymentType: PaymentType;
};
