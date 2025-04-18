import { memo, useCallback, useEffect, useMemo } from 'react';
import { useStore } from 'effector-react';
import Backdrop from '@mui/material/Backdrop';
import { Slide, useMediaQuery } from '@mui/material';
import { ClickAwayListener } from '@mui/base';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';

import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// common
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';

// components
import { SubscriptionPlanItem } from '@components/Payments/SubscriptionsPlans/SubscriptionPlanItem';
import { SubscriptionPlansWrapper } from '@components/Payments/SubscriptionsPlans/SubscritionPlansWrapper';

// types
import { PlanKeys } from 'shared-types';
import { SubscriptionsPlansProps } from './types';

// hooks

// stores
import {
    $productsStore,
    $profileStore,
    getStripeProductsFx,
} from '../../../store';

// styles
import styles from './SubscriptionsPlans.module.scss';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

const Component = ({
    isSubscriptionStep,
    onChooseSubscription,
    isDisabled,
    activePlanKey,
    title = false,
    withBackgroundBlur = false,
    withActivePlan = true,
    onClose,
    buttonTranslation,
    onlyPaidPlans = true,
    isCreate = false
}: SubscriptionsPlansProps) => {
    const products = useStore($productsStore);
    const profile = useStore($profileStore);
    const isProductsLoading = useStore(getStripeProductsFx.pending);

    const is1320Media = useMediaQuery('(max-width:1320px)');

    useEffect(() => {
        (async () => {
            if (isSubscriptionStep && !products.length) {
                await getStripeProductsFx({});
            }
        })();
    }, [isSubscriptionStep, products.length]);

    const handleChosenSubscription = useCallback(
        async (productId: string, isPaid: boolean, trial: boolean) => {
            onChooseSubscription(productId, isPaid, trial);
        },
        [onChooseSubscription],
    );

    const productFiltered = useMemo(
        () => products.filter(item => {
            if (isCreate) {
                return item?.product?.name === PlanKeys.Business
            } else {
                return item?.product?.name !== activePlanKey
            }
        }),
        [products],
    );

    const renderSubscriptionPlans = useMemo(() => {
        return productFiltered.map((product, i) => {
            return !is1320Media ? (
                <Slide key={product?.product?.name} in timeout={i * 200}>
                    <SubscriptionPlanItem
                        activePlanKey={activePlanKey}
                        product={product?.product}
                        price={product?.price}
                        onChooseSubscription={handleChosenSubscription}
                        isDisabled={isDisabled}
                        buttonTranslation={buttonTranslation}
                        withTrial={
                            product?.product?.name === PlanKeys.Professional &&
                            profile.isProfessionalTrialAvailable
                        }
                    />
                </Slide>
            ) : (
                <SubscriptionPlanItem
                    withoutTitle
                    key={product?.product?.name}
                    activePlanKey={activePlanKey}
                    product={product?.product}
                    price={product?.price}
                    onChooseSubscription={handleChosenSubscription}
                    isDisabled={isDisabled}
                    buttonTranslation={buttonTranslation}
                    withTrial={
                        product?.product?.name === PlanKeys.Professional &&
                        profile.isProfessionalTrialAvailable
                    }
                />
            );
        });
    }, [
        productFiltered,
        is1320Media,
        isDisabled,
        activePlanKey,
        onlyPaidPlans,
        withActivePlan,
        buttonTranslation,
        handleChosenSubscription,
        profile.isProfessionalTrialAvailable,
    ]);

    const handleClose = useCallback(() => {
        onClose?.();
    }, []);

    return (
        <Backdrop
            sx={{
                zIndex: theme => theme.zIndex.drawer + 1,
                pointerEvents: 'none',
                backdropFilter: withBackgroundBlur ? 'blur(28px)' : undefined,
                width: '100%',
                height: '100vh',
            }}
            open={isSubscriptionStep}
        >
            <ConditionalRender condition={isProductsLoading}>
                <CustomLoader />
            </ConditionalRender>
            <ConditionalRender
                condition={
                    Boolean(productFiltered.length) && isSubscriptionStep
                }
            >
                <ClickAwayListener onClickAway={handleClose}>
                    <CustomGrid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        gap={4}
                        className={styles.subscriptionScrollWrapper}
                    >
                        <CustomGrid
                            container
                            justifyContent="center"
                            alignItems="center"
                            gap={1}
                            className={styles.subscriptionTitle}
                        >
                            {title ?
                                (<CustomGrid
                                    container
                                    item
                                    alignItems="center"
                                    justifyContent="center"
                                    gap={5}
                                    className={styles.subscriptionPlansTitle}
                                >
                                    <CustomTypography
                                        variant="h2"
                                        nameSpace="subscriptions"
                                        translation="upgradePlan.title"
                                        color="white"
                                    />
                                    <CustomImage
                                        src="/images/rocket-transpt.png"
                                        width="40px"
                                        height="40px"
                                        className={styles.rocketIcon}
                                    />
                                </CustomGrid>)
                                : (
                                    <>
                                        <CustomImage
                                            src="/images/winking-face.webp"
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
                        <CustomGrid
                            container
                            gap={3.5}
                            justifyContent="center"
                            wrap="nowrap"
                            alignItems="stretch"
                            className={styles.subscriptionContent}
                        >
                            {is1320Media ? (
                                <SubscriptionPlansWrapper
                                    products={productFiltered}
                                >
                                    {renderSubscriptionPlans}
                                </SubscriptionPlansWrapper>
                            ) : (
                                renderSubscriptionPlans
                            )}
                        </CustomGrid>
                    </CustomGrid>
                </ClickAwayListener>
            </ConditionalRender>
        </Backdrop>
    );
};

export const SubscriptionsPlans = memo(Component);
