export type CardDataFormProps = {
    paymentIntentSecret: string;
    colorForm?: string
    onSubmit: () => void;
    onError: () => void;
};
