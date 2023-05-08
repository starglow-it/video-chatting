import { ReactNode } from "react";

export type PaymentFormProps = {
    onClose?: () => void;
    templateType?: string
    subLabel?: ReactNode
};
