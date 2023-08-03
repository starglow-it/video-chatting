export type SubscriptionPlanCardProps = {
    product: any;
    price: any;
    onChooseSubscription: (
        productId: string,
        isPaid: boolean,
        trial: boolean,
    ) => void;
    isDisabled: boolean;
    isActive?: boolean;
    isHighlighted?: boolean;
    withTrial?: boolean;
    priceLabel?: string;
    isTrial?: boolean;
};

export type TranslationFeatureItem = {
    key: string;
    text: string;
    subText: string;
};
