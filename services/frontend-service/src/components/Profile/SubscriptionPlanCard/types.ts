export type SubscriptionPlanCardProps = {
    activePlanKey: string;
    product: unknown;
    price: unknown;
    onChooseSubscription: (productId: string, isPaid: boolean, trial: boolean) => void;
    onOpenPlans: () => void;
    isDisabled: boolean;
    withTrial?: boolean;
};
