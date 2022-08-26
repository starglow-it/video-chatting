export type SubscriptionPlanCardProps = {
    activePlanKey: string;
    product: unknown;
    price: unknown;
    onChooseSubscription: (productId: string, isPaid: boolean) => void;
    onOpenPlans: () => void;
    isDisabled: boolean;
};
