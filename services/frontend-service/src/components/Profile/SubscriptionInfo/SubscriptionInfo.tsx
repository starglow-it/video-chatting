import React, { useMemo, memo, useEffect } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

// hooks
import { useSubscriptionNotification } from '@hooks/useSubscriptionNotification';
import { useLocalization } from '@hooks/useTranslation';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { ShopIcon } from 'shared-frontend/icons/OtherIcons/ShopIcon';

import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';
import { Translation } from '@library/common/Translation/Translation';

// components
import { SubscriptionPlanCard } from '@components/Profile/SubscriptionPlanCard/SubscriptionPlanCard';

// store
import { PlanKeys } from 'shared-types';
import {
    $isTrial,
    $productsStore,
    $profileStore,
    $subscriptionStore,
    getCustomerPortalSessionUrlFx,
    getStripeProductsFx,
    getSubscriptionFx,
    startCheckoutSessionForSubscriptionFx,
} from '../../../store';

// helpers
import { formatDate } from '../../../utils/time/formatDate';

// styles
import styles from './SubscriptionInfo.module.scss';

// const
import { profileRoute } from '../../../const/client-routes';

// utils
import { emptyFunction } from '../../../utils/functions/emptyFunction';

const Component = () => {
    const router = useRouter();
    const subscription = useStore($subscriptionStore);
    const profile = useStore($profileStore);
    const products = useStore($productsStore);
    const isTrial = useStore($isTrial);

    const isSubscriptionPurchasePending = useStore(
        startCheckoutSessionForSubscriptionFx.pending,
    );
    const isGetProductsPending = useStore(getStripeProductsFx.pending);

    const { translation } = useLocalization('subscriptions');

    useSubscriptionNotification(profileRoute);

    useEffect(() => {
        getSubscriptionFx({
            subscriptionId: profile.stripeSubscriptionId,
        });
    }, [profile.stripeSubscriptionId, profile.subscriptionPlanKey]);

    const handleChooseSubscription = async (
        productId: string,
        isPaid: boolean,
        trial: boolean,
    ) => {
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
        ? formatDate(
              (subscription?.current_period_end || Date.now()) * 1000,
              'dd MMM, yyyy',
          )
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
                    isActive={
                        profile.subscriptionPlanKey === product?.product?.name
                    }
                    isTrial={
                        profile.subscriptionPlanKey ===
                            product?.product?.name && isTrial
                    }
                    product={product?.product}
                    price={product?.price}
                    onChooseSubscription={handleChooseSubscription}
                    isDisabled={isSubscriptionPurchasePending}
                    withTrial={
                        product?.product?.name === PlanKeys.Professional &&
                        profile.isProfessionalTrialAvailable
                    }
                />
            )),
        [
            isTrial,
            products,
            profile.subscriptionPlanKey,
            profile.isProfessionalTrialAvailable,
            isSubscriptionPurchasePending,
        ],
    );

    const shouldShowManageButton =
        Boolean(profile.stripeSubscriptionId) && !isTrial;
    const shouldShowNextRenewalDate =
        Boolean(nextPaymentDate) && !isGetProductsPending;
    const planTranslation = `${profile.subscriptionPlanKey || PlanKeys.House}${
        isTrial ? ' (Trial)' : ''
    }`;

    return (
        <CustomPaper className={styles.paperWrapper}>
            <a id="subscriptions" />
            <CustomGrid container direction="column">
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent={
                        shouldShowNextRenewalDate
                            ? 'space-between'
                            : 'flex-start'
                    }
                >
                    <CustomGrid
                        item
                        container
                        alignItems="center"
                        gap={1}
                        width="fit-content"
                    >
                        <ShopIcon
                            width="25px"
                            height="24px"
                            className={styles.icon}
                        />
                        <CustomTypography
                            dangerouslySetInnerHTML={{
                                __html: translation('subscriptions.current', {
                                    currentSub: planTranslation,
                                }),
                            }}
                        />
                    </CustomGrid>
                    <ConditionalRender condition={shouldShowNextRenewalDate}>
                        <CustomTypography
                            className={styles.nextPayment}
                            color="colors.grayscale.normal"
                            nameSpace="subscriptions"
                            translation={`subscriptions.${
                                isTrial ? 'expirationDate' : 'nextPayment'
                            }`}
                            options={{ nextPaymentDate }}
                        />
                    </ConditionalRender>
                </CustomGrid>
                <ConditionalRender condition={shouldShowManageButton}>
                    <CustomButton
                        className={styles.manage}
                        label={
                            <Translation
                                nameSpace="subscriptions"
                                translation="subscriptions.manage"
                            />
                        }
                        onClick={handleOpenSubscriptionPortal}
                    />
                </ConditionalRender>
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="center"
                    gap={2.5}
                    className={styles.plans}
                >
                    {isGetProductsPending ? (
                        <CustomLoader />
                    ) : (
                        <>
                            {renderSubscriptionPlans}
                            {/* <SubscriptionPlanCard
                                key="AllPlans"
                                isHighlighted
                                product={{
                                    name: 'All Plans',
                                }}
                                price={{
                                    unit_amount: 0,
                                }}
                                onChooseSubscription={emptyFunction}
                                isDisabled={isSubscriptionPurchasePending}
                                priceLabel="subscriptions.AllPlans.label"
                            /> */}
                        </>
                    )}
                </CustomGrid>
            </CustomGrid>
        </CustomPaper>
    );
};

export const SubscriptionInfo = memo(Component);
