import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useStore } from 'effector-react';
import Backdrop from '@mui/material/Backdrop';
import { ListItemIcon, Slide } from '@mui/material';
import { ClickAwayListener } from '@mui/base';
import clsx from 'clsx';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// common
import { WiggleLoader } from '@library/common/WiggleLoader/WiggleLoader';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// components
import { SubscriptionPlanItem } from '@components/Payments/SubscriptionsPlans/SubscriptionPlanItem';

// types
import {
    SubscriptionsPlansProps,
    TranslationFeatureItem,
} from '@components/Payments/SubscriptionsPlans/types';

// hooks
import { useLocalization } from '@hooks/useTranslation';

// icons
import { RoundCheckIcon } from '@library/icons/RoundIcons/RoundCheckIcon';

// shared
import { CustomImage } from 'shared-frontend/library';

// stores
import { $productsStore, $profileStore, getStripeProductsFx } from '../../../store';

// styles
import styles from './SubscriptionsPlans.module.scss';

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
    onlyPaidPlans = false,
}: SubscriptionsPlansProps) => {
    const products = useStore($productsStore);
    const profile = useStore($profileStore);
    const isProductsLoading = useStore(getStripeProductsFx.pending);

    const { translation } = useLocalization('subscriptions');

    useEffect(() => {
        (async () => {
            if (isSubscriptionStep && !products.length) {
                await getStripeProductsFx();
            }
        })();
    }, [isSubscriptionStep, products.length]);

    const handleChosenSubscription = useCallback(
        async (productId: string, isPaid: boolean, trial: boolean) => {
            onChooseSubscription(productId, isPaid, trial);
        },
        [onChooseSubscription],
    );

    const renderSubscriptionPlans = useMemo(
        () =>
            products
                .filter(
                    product =>
                        (withActivePlan || product?.product?.name !== activePlanKey) &&
                        (!onlyPaidPlans || (onlyPaidPlans && product?.price?.unit_amount)),
                )
                .map((product, i) => (
                    <Slide key={product?.product?.name} in timeout={i * 200}>
                        <SubscriptionPlanItem
                            activePlanKey={activePlanKey}
                            product={product?.product}
                            price={product?.price}
                            onChooseSubscription={handleChosenSubscription}
                            isDisabled={isDisabled}
                            buttonTranslation={buttonTranslation}
                            withTrial={
                                product?.product?.name === 'Professional' &&
                                profile.isProfessionalTrialAvailable
                            }
                        />
                    </Slide>
                )),
        [
            products,
            isDisabled,
            activePlanKey,
            onlyPaidPlans,
            withActivePlan,
            buttonTranslation,
            handleChosenSubscription,
            profile.isProfessionalTrialAvailable,
        ],
    );

    const commonFeatures = useMemo(() => {
        const translationsObject = translation('subscriptions.AllPlans') as unknown as {
            featuresPlans: TranslationFeatureItem[][];
        };

        const renderFeature = featuresChunk => (
            <CustomGrid
                item
                container
                flexWrap="nowrap"
                flex="28%"
                direction="column"
                className={styles.column}
            >
                {featuresChunk.map(({ text }) => (
                    <CustomGrid item container gap={1} flexWrap="nowrap">
                        <ListItemIcon classes={{ root: styles.listIcon }}>
                            <RoundCheckIcon width="16px" height="16px" />
                        </ListItemIcon>
                        <CustomTypography color="colors.white.primary">{text}</CustomTypography>
                    </CustomGrid>
                ))}
            </CustomGrid>
        );

        return (
            <CustomGrid
                container
                direction="column"
                className={clsx(styles.allFeaturesCard, {
                    [styles.fullWidth]: renderSubscriptionPlans.length >= 3,
                })}
            >
                <CustomBox className={styles.productName}>
                    <CustomTypography
                        variant="body2bold"
                        color="colors.white.primary"
                        nameSpace="subscriptions"
                        translation="subscriptions.AllPlans.plan"
                    />
                </CustomBox>
                <CustomTypography
                    variant="body2bold"
                    color="colors.white.primary"
                    nameSpace="subscriptions"
                    translation="subscriptions.AllPlans.label"
                    className={styles.price}
                />
                <CustomGrid container direction="column" gap={1.75} className={styles.listWrapper}>
                    {translationsObject.featuresPlans.map(renderFeature)}
                </CustomGrid>
            </CustomGrid>
        );
    }, [renderSubscriptionPlans.length, translation]);

    const handleClose = useCallback(() => {
        onClose?.();
    }, []);

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
                                    <CustomImage
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
                        <CustomGrid
                            container
                            gap={3.5}
                            justifyContent="center"
                            alignItems="stretch"
                        >
                            <ConditionalRender condition={renderSubscriptionPlans.length < 3}>
                                {commonFeatures}
                            </ConditionalRender>
                            {renderSubscriptionPlans}
                        </CustomGrid>
                        <ConditionalRender condition={renderSubscriptionPlans.length >= 3}>
                            {commonFeatures}
                        </ConditionalRender>
                    </CustomGrid>
                </ClickAwayListener>
            </ConditionalRender>
        </Backdrop>
    );
};

export const SubscriptionsPlans = memo(Component);
