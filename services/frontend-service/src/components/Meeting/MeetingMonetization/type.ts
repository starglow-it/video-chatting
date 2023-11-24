import { StripeCurrency } from 'shared-const';

export type FormDataPayment = {
    enabledMeeting: boolean;
    enabledPaywall: boolean;
    templatePrice: number;
    paywallPrice: number;
    templateCurrency: StripeCurrency;
    paywallCurrency: StripeCurrency;
};

export type ChargeButtonProps = {
    children?: any;
    tooltipButton: string | JSX.Element;
    onClose?(): void;
    onToggle?: (isToggle: boolean) => void;
    transformOriginVertical?: number;
};

export enum TabsValues {
    Participants = 1,
    Audience = 2,
}
