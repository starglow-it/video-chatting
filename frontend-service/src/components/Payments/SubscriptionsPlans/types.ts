export type SubscriptionPlanItemProps = {
    activePlanKey?: string;
    isDisabled: boolean;
    product: any;
    price: any;
    onChooseSubscription: (productId: string, isPaid: boolean) => void;
};

export type SubscriptionsPlansProps = {
    activePlanKey?: string;
    isDisabled: boolean;
    title?: JSX.Element;
    onClose?: () => void;
    isSubscriptionStep: boolean;
    withBackgroundBlur?: boolean;
    withActivePlan?: boolean;
    onChooseSubscription: (productId: string, isPaid: boolean) => void;
};
