import React, { useMemo, memo, useEffect } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

// hooks
import { useToggle } from '@hooks/useToggle';
import { useSubscriptionNotification } from '@hooks/useSubscriptionNotification';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

// common
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// components
import { SubscriptionsPlans } from '@components/Payments/SubscriptionsPlans/SubscriptionsPlans';
import { ShopIcon } from '@library/icons/ShopIcon';
import { WiggleLoader } from '@library/common/WiggleLoader/WiggleLoader';
import { SubscriptionPlanCard } from '@components/Profile/SubscriptionPlanCard/SubscriptionPlanCard';

// store
import {
    $isTrial,
    $productsStore,
    $profileStore,
    $subscriptionStore,
    getCustomerPortalSessionUrlFx,
    getStripeProductsFx,
    getSubscriptionWithDataFx,
    startCheckoutSessionForSubscriptionFx,
} from '../../../store';

// helpers
import { formatDate } from '../../../utils/time/formatDate';

// styles
import styles from './SubscriptionInfo.module.scss';

// const
import { profileRoute } from '../../../const/client-routes';
import {useLocalization} from "@hooks/useTranslation";

const Component = () => {
    const router = useRouter();
    const subscription = useStore($subscriptionStore);
    const profile = useStore($profileStore);
    const products = useStore($productsStore);

    const isSubscriptionPurchasePending = useStore(startCheckoutSessionForSubscriptionFx.pending);
    const isGetProductsPending = useStore(getStripeProductsFx.pending);
    const isTrial = useStore($isTrial);

    const {
        value: isSubscriptionsOpen,
        onSwitchOn: handleOpenSubscriptionPlans,
        onSwitchOff: handleCloseSubscriptionPlans,
    } = useToggle(false);

    const { translation } = useLocalization('subscriptions')

    useEffect(() => {
        getStripeProductsFx();
        getSubscriptionWithDataFx();
    }, []);

    useSubscriptionNotification(profileRoute);

    const handleChooseSubscription = async (productId: string, isPaid: boolean, trial: boolean) => {
        if (isPaid && (!profile.stripeSubscriptionId || isTrial)) {
            const response = await startCheckoutSessionForSubscriptionFx({
                productId,
                baseUrl: profileRoute,
                withTrial: trial,
            });

            if (response?.url) {
                return router.push(response.url);
            }
        } else if (profile.stripeSubscriptionId) {
            const response = await getCustomerPortalSessionUrlFx({
                subscriptionId: profile.stripeSubscriptionId,
            });

            if (response?.url) {
                return router.push(response.url);
            }
        }
    };

    const nextPaymentDate = subscription?.current_period_end
        ? formatDate((subscription?.current_period_end || Date.now()) * 1000, 'dd MMM, yyyy')
        : '';

    const handleOpenSubscriptionPortal = async () => {
        const response = await getCustomerPortalSessionUrlFx({
            subscriptionId: profile.stripeSubscriptionId,
        });

        if (response?.url) {
            return router.push(response.url);
        }
    };

    const renderSubscriptionPlans = useMemo(
        () =>
            products.map(product => (
                <SubscriptionPlanCard
                    key={product?.product?.id}
                    activePlanKey={profile.subscriptionPlanKey}
                    product={product?.product}
                    price={product?.price}
                    onOpenPlans={handleOpenSubscriptionPlans}
                    onChooseSubscription={handleChooseSubscription}
                    isDisabled={isSubscriptionPurchasePending}
                    withTrial={product?.product?.name === 'Professional' && profile.isProfessionalTrialAvailable}
                />
            )),
        [
            products,
            profile.subscriptionPlanKey,
            profile.isProfessionalTrialAvailable,
            isSubscriptionPurchasePending,
        ],
    );

    return (
        <CustomPaper className={styles.paperWrapper}>
            <CustomGrid container direction="column" gap={3.5}>
                <CustomGrid container alignItems="center" gap={1}>
                    <ShopIcon width="25px" height="24px" className={styles.icon} />
                    <CustomTypography
                        dangerouslySetInnerHTML={{
                            __html: translation('subscriptions.current', {
                                currentSub: profile.subscriptionPlanKey || 'House',
                            })
                        }}
                    />
                    <ConditionalRender condition={Boolean(profile.stripeSubscriptionId)}>
                        <CustomTypography
                            className={styles.manage}
                            nameSpace="subscriptions"
                            color="colors.blue.primary"
                            translation="subscriptions.manage"
                            onClick={handleOpenSubscriptionPortal}
                        />
                    </ConditionalRender>
                    <ConditionalRender condition={Boolean(nextPaymentDate)}>
                        <CustomTypography
                            className={styles.nextPayment}
                            color="colors.grayscale.normal"
                            nameSpace="subscriptions"
                            translation="subscriptions.nextPayment"
                            options={{ nextPaymentDate }}
                        />
                    </ConditionalRender>
                </CustomGrid>
                <CustomGrid container alignItems="center" justifyContent="center" gap={2.5}>
                    {isGetProductsPending ? <WiggleLoader /> : renderSubscriptionPlans}
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
    );
};

export const SubscriptionInfo = memo(Component);
