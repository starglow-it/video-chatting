export type SubscriptionPlanItemProps = {
    activePlanKey: string;
    isDisabled: boolean;
    product: any;
    price: any;
    onChooseSubscription: (productId: string, isPaid: boolean) => void;
};

export type SubscriptionsPlansProps = {
    activePlanKey?: string;
    isDisabled: boolean;
    onClose?: () => void;
    isSubscriptionStep: boolean;
    onChooseSubscription: (productId: string, isPaid: boolean) => void;
};
