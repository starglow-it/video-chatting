import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useStore } from 'effector-react';
import Image from 'next/image';
import Backdrop from '@mui/material/Backdrop';
import { Slide } from '@mui/material';
import { ClickAwayListener } from '@mui/base';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// common
import { WiggleLoader } from '@library/common/WiggleLoader/WiggleLoader';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// components
import { SubscriptionPlanItem } from '@components/Payments/SubscriptionsPlans/SubscriptionPlanItem';

// types
import { SubscriptionsPlansProps } from '@components/Payments/SubscriptionsPlans/types';

// stores
import { $productsStore, getStripeProductsFx } from '../../../store';

const Component = ({
    isSubscriptionStep,
    onChooseSubscription,
    isDisabled,
    activePlanKey,
    title,
    withBackgroundBlur = false,
    withActivePlan = true,
    onClose,
    buttonTranslation,
}: SubscriptionsPlansProps) => {
    const products = useStore($productsStore);
    const isProductsLoading = useStore(getStripeProductsFx.pending);

    useEffect(() => {
        (async () => {
            if (isSubscriptionStep && !products.length) {
                await getStripeProductsFx();
            }
        })();
    }, [isSubscriptionStep, products.length]);

    const handleChosenSubscription = useCallback(
        async (productId: string, isPaid: boolean) => {
            onChooseSubscription(productId, isPaid);
        },
        [onChooseSubscription],
    );

    const renderSubscriptionPlans = useMemo(
        () =>
            products
                .filter(product => withActivePlan || product?.product?.name !== activePlanKey)
                .map((product, i) => (
                    <Slide key={product?.product?.name} in timeout={i * 200}>
                        <SubscriptionPlanItem
                            activePlanKey={activePlanKey}
                            product={product?.product}
                            price={product?.price}
                            onChooseSubscription={handleChosenSubscription}
                            isDisabled={isDisabled}
                            buttonTranslation={buttonTranslation}
                        />
                    </Slide>
                )),
        [products, isDisabled, activePlanKey, withActivePlan, buttonTranslation, handleChosenSubscription],
    );

    const handleClose = () => {
        onClose?.();
    };

    return (
        <Backdrop
            sx={{
                zIndex: theme => theme.zIndex.drawer + 1,
                pointerEvents: 'none',
                backdropFilter: withBackgroundBlur ? 'blur(28px)' : undefined,
            }}
            open={isSubscriptionStep}
        >
            <ConditionalRender condition={isProductsLoading}>
                <WiggleLoader />
            </ConditionalRender>
            <ConditionalRender condition={Boolean(products.length) && isSubscriptionStep}>
                <ClickAwayListener onClickAway={handleClose}>
                    <CustomGrid container direction="column" justifyContent="center" gap={4}>
                        <CustomGrid container justifyContent="center" alignItems="center" gap={1}>
                            {title ?? (
                                <>
                                    <Image
                                        src="/images/winking-face.png"
                                        width="30px"
                                        height="30px"
                                    />
                                    <CustomTypography
                                        variant="h2bold"
                                        nameSpace="subscriptions"
                                        color="colors.white.primary"
                                        translation="subscriptions.selectPlan"
                                    />
                                </>
                            )}
                        </CustomGrid>
                        <CustomGrid container gap={2} justifyContent="center" alignItems="stretch">
                            {renderSubscriptionPlans}
                        </CustomGrid>
                    </CustomGrid>
                </ClickAwayListener>
            </ConditionalRender>
        </Backdrop>
    );
};

export const SubscriptionsPlans = memo(Component);
