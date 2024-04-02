export type SubscriptionsPlansProps = {
    activePlanKey?: string;
    isDisabled: boolean;
    title?: JSX.Element;
    onClose?: () => void;
    isSubscriptionStep: boolean;
    withBackgroundBlur?: boolean;
    withActivePlan?: boolean;
    onChooseSubscription: (
        productId: string,
        isPaid: boolean,
        trial: boolean,
    ) => void;
    buttonTranslation?: string;
    onlyPaidPlans?: boolean;
    isCreate?: boolean;
};

export type SubscriptionPlanItemProps = {
    activePlanKey?: string;
    isDisabled: boolean;
    product: any;
    price: any;
    withoutTitle?: boolean;
    onChooseSubscription: SubscriptionsPlansProps['onChooseSubscription'];
    buttonTranslation?: string;
    withTrial?: boolean;
};

export type TranslationFeatureItem = {
    key: string;
    text: string;
    subText: string;
    type?: string;
};
