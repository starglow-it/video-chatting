export type SubscriptionPlanItemProps = {
    activePlanKey?: string;
    isDisabled: boolean;
    product: any;
    price: any;
    onChooseSubscription: SubscriptionsPlansProps['onChooseSubscription'];
    buttonTranslation?: string;
    withTrial?: boolean;
};

export type SubscriptionsPlansProps = {
    activePlanKey?: string;
    isDisabled: boolean;
    title?: JSX.Element;
    onClose?: () => void;
    isSubscriptionStep: boolean;
    withBackgroundBlur?: boolean;
    withActivePlan?: boolean;
    onChooseSubscription: (productId: string, isPaid: boolean, trial: boolean) => void;
    buttonTranslation?: string;
    onlyPaidPlans?: boolean;
};
