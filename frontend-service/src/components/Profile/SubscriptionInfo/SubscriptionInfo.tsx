import React, {useMemo, memo, useEffect} from "react";
import {useStore} from "effector-react";
import { useRouter } from "next/router";
import {Trans} from "react-i18next";

// hooks
import {useSubscriptionNotification} from "../../../hooks/useSubscriptionNotification";
import {useLocalization} from "../../../hooks/useTranslation";
import {useToggle} from "../../../hooks/useToggle";

// custom
import {CustomGrid} from "@library/custom/CustomGrid/CustomGrid";
import {CustomTypography} from "@library/custom/CustomTypography/CustomTypography";
import {CustomPaper} from "@library/custom/CustomPaper/CustomPaper";

// components
import {SubscriptionsPlans} from "@components/Payments/SubscriptionsPlans/SubscriptionsPlans";
import {ShopIcon} from "@library/icons/ShopIcon";
import { WiggleLoader } from "@library/common/WiggleLoader/WiggleLoader";
import {SubscriptionPlanCard} from "@components/Profile/SubscriptionPlanCard/SubscriptionPlanCard";

// store
import {
    $productsStore,
    $profileStore,
    $subscriptionStore,
    getCustomerPortalSessionUrlFx,
    getStripeProductsFx,
    getSubscriptionWithDataFx,
    startCheckoutSessionForSubscriptionFx
} from "../../../store";

// helpers
import {formatDate} from "../../../utils/time/formatDate";

// styles
import styles from "./SubscriptionInfo.module.scss";

const Component = () => {
    const router = useRouter();
    const subscription = useStore($subscriptionStore);
    const profile = useStore($profileStore);
    const products = useStore($productsStore);

    const isSubscriptionPurchasePending = useStore(startCheckoutSessionForSubscriptionFx.pending);
    const isGetProductsPending = useStore(getStripeProductsFx.pending);

    const {
        value: isSubscriptionsOpen,
        onSwitchOn: handleOpenSubscriptionPlans,
        onSwitchOff: handleCloseSubscriptionPlans
    } = useToggle(false);

    useEffect(() => {
        getStripeProductsFx();
        getSubscriptionWithDataFx();
    }, []);

    useSubscriptionNotification();

    const handleChooseSubscription = async (productId: string, isPaid: boolean) => {
        if (isPaid && !profile.stripeSubscriptionId) {
            const response = await startCheckoutSessionForSubscriptionFx({ productId, baseUrl: "/dashboard/profile" });

            if (response?.url) {
                return router.push(response.url);
            }
        } else if (profile.stripeSubscriptionId) {
            const response = await getCustomerPortalSessionUrlFx({ subscriptionId: profile.stripeSubscriptionId });

            if (response?.url) {
                return router.push(response.url);
            }
        }
    }

    const nextPaymentDate = subscription?.current_period_end ? formatDate(subscription?.current_period_end * 1000, 'dd MMM, yyyy') : '';

    const handleOpenSubscriptionPortal = async () => {
        const response = await getCustomerPortalSessionUrlFx({ subscriptionId: profile.stripeSubscriptionId });

        if (response?.url) {
            return router.push(response.url);
        }
    }

    const renderSubscriptionPlans = useMemo(() => products.map(product => {
        return (
            <SubscriptionPlanCard
                key={product?.product?.id}
                activePlanKey={profile.subscriptionPlanKey}
                product={product?.product}
                price={product?.price}
                onOpenPlans={handleOpenSubscriptionPlans}
                onChooseSubscription={handleChooseSubscription}
                isDisabled={isSubscriptionPurchasePending}
            />
        )
    }), [products, profile.subscriptionPlanKey, isSubscriptionPurchasePending]);

    const { translation } = useLocalization('subscriptions');

    return (
        <CustomPaper className={styles.paperWrapper}>
            <CustomGrid container direction="column" gap={3.5}>
                <CustomGrid container alignItems="center" gap={1}>
                    <ShopIcon width="25px" height="24px" className={styles.icon} />
                    <Trans i18nKey="subscriptions.current">
                        {translation("subscriptions.current", {currentSub: profile.subscriptionPlanKey || "House"})}
                    </Trans>
                    {profile.stripeSubscriptionId
                        ? (
                            <CustomTypography
                                className={styles.manage}
                                nameSpace="subscriptions"
                                color="colors.blue.primary"
                                translation="subscriptions.manage"
                                onClick={handleOpenSubscriptionPortal}
                            />
                        )
                        : null
                    }
                    {nextPaymentDate
                        ? (
                            <CustomTypography
                                className={styles.nextPayment}
                                color="colors.grayscale.normal"
                                nameSpace="subscriptions"
                                translation="subscriptions.nextPayment"
                                options={{nextPaymentDate}}
                            />
                        )
                        : null
                    }
                </CustomGrid>
                <CustomGrid container alignItems="center" justifyContent="center" gap={2.5}>
                    {isGetProductsPending
                        ? (
                            <WiggleLoader />
                        )
                        : renderSubscriptionPlans
                    }
                </CustomGrid>
            </CustomGrid>
            <SubscriptionsPlans
                activePlanKey={profile.subscriptionPlanKey}
                isSubscriptionStep={isSubscriptionsOpen}
                onChooseSubscription={handleChooseSubscription}
                onClose={handleCloseSubscriptionPlans}
                isDisabled={isSubscriptionPurchasePending}
            />
        </CustomPaper>
    )
}

export const SubscriptionInfo = memo(Component);