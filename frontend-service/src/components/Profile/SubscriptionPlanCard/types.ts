export type SubscriptionPlanCardProps = {
    activePlanKey: string;
    product: any;
    price: any;
    onChooseSubscription: (productId: string, isPaid: boolean) => void;
    onOpenPlans: () => void;
    isDisabled: boolean;
}