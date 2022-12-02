import React, { useMemo, ForwardedRef, memo, forwardRef, useCallback } from 'react';
import clsx from 'clsx';
import { List, ListItem, ListItemIcon } from '@mui/material';

// hooks
import { useLocalization } from '@hooks/useTranslation';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid, CustomBox, CustomButton } from 'shared-frontend/library';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';

// common
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// icons
import { RoundCheckIcon } from 'shared-frontend/icons';

// shared
import { CustomImage } from 'shared-frontend/library';

// styles
import { currencies } from 'src/const/profile/subscriptions';
import { planColors } from "shared-const";

// types
import { Translation } from '@library/common/Translation/Translation';
import { SubscriptionPlanItemProps, TranslationFeatureItem } from './types';

// styles
import styles from './SubscriptionsPlans.module.scss';

const Component = (
    {
        product,
        price,
        onChooseSubscription,
        isDisabled,
        activePlanKey,
        withoutTitle = false,
        buttonTranslation = 'buttons.start',
        withTrial = false,
    }: SubscriptionPlanItemProps,
    ref: ForwardedRef<HTMLDivElement>,
) => {
    const isFree = price.unit_amount === 0;

    const handleChooseSubscription = useCallback(() => {
        if (product.name !== activePlanKey) {
            onChooseSubscription(product.id, !isFree, false);
        }
    }, [isFree, product.id, product.name, activePlanKey, onChooseSubscription]);

    const handleChooseTrial = useCallback(() => {
        onChooseSubscription(product.id, !isFree, true);
    }, [isFree, product.id, product.name, onChooseSubscription]);

    const { translation } = useLocalization('subscriptions');

    const priceString = !isFree
        ? `${currencies[price?.currency]}${price.unit_amount / 100}`
        : 'FREE';

    const templateFeaturesText = translation(`subscriptions.${product.name}`) as unknown as {
        features: TranslationFeatureItem[][];
        trialHint?: string;
    };

    const renderFeaturesListItems = useMemo(
        () =>
            templateFeaturesText?.features?.map((features, index) => (
                <CustomGrid key={index} container direction="column">
                    {features.map(feature => (
                        <ListItem
                            key={feature.key}
                            alignItems="flex-start"
                            disablePadding
                            className={styles.listItem}
                        >
                            <ListItemIcon classes={{ root: styles.listIcon }}>
                                <RoundCheckIcon width="16px" height="16px" />
                            </ListItemIcon>
                            <CustomGrid container direction="column">
                                <CustomTypography variant="body1">{feature.text}</CustomTypography>
                                <CustomTypography variant="body2" className={styles.subText}>
                                    {feature.subText}
                                </CustomTypography>
                            </CustomGrid>
                        </ListItem>
                    ))}
                </CustomGrid>
            )),
        [],
    );

    const isActive = activePlanKey === product.name;

    return (
        <CustomPaper ref={ref} className={styles.wrapper}>
            <CustomGrid container direction="column" wrap="nowrap">
                {!withoutTitle && (
                    <CustomBox
                        className={styles.productName}
                        sx={{backgroundColor: planColors[product.name as string]}}
                    >
                        <CustomTypography variant="body2bold" color="colors.white.primary">
                            {product.name}
                        </CustomTypography>
                    </CustomBox>
                )}
                <CustomGrid className={styles.priceWrapper}>
                    <CustomTypography className={styles.price}>{priceString}</CustomTypography>
                    <ConditionalRender condition={!isFree}>
                        <CustomTypography>/ {price?.recurring?.interval}</CustomTypography>
                    </ConditionalRender>
                </CustomGrid>

                <CustomTypography variant="body1" className={styles.description}>
                    {product.description}
                </CustomTypography>

                <List className={styles.listWrapper}>
                    <CustomScroll>{renderFeaturesListItems}</CustomScroll>
                </List>

                <CustomGrid container direction="column" className={styles.buttons}>
                    <ConditionalRender condition={withTrial}>
                        <CustomTooltip
                            arrow
                            title={
                                <CustomTypography
                                    dangerouslySetInnerHTML={{
                                        __html: translation(templateFeaturesText.trialHint ?? ''),
                                    }}
                                    className={styles.trialText}
                                />
                            }
                            placement="top"
                            variant="white"
                            popperClassName={styles.popper}
                        >
                            <CustomButton
                                variant="custom-black"
                                label={
                                    <Translation
                                        nameSpace="subscriptions"
                                        translation="buttons.tryForFree"
                                    />
                                }
                                onClick={handleChooseTrial}
                                disabled={isDisabled}
                                className={styles.trialButton}
                                Icon={
                                    <CustomBox className={styles.icon}>
                                        <CustomImage
                                            src="/images/ok-hand.png"
                                            width="20px"
                                            height="20px"
                                            alt="ok-hand"
                                        />
                                    </CustomBox>
                                }
                            />
                        </CustomTooltip>
                    </ConditionalRender>
                    <CustomButton
                        label={
                            <Translation
                                nameSpace="subscriptions"
                                translation={
                                    isActive
                                        ? 'buttons.currentPlan'
                                        : `${buttonTranslation}${product.name}`
                                }
                            />
                        }
                        disabled={isDisabled}
                        onClick={handleChooseSubscription}
                        className={clsx(styles.button, { [styles.active]: isActive })}
                    />
                </CustomGrid>
            </CustomGrid>
        </CustomPaper>
    );
};

export const SubscriptionPlanItem = memo(forwardRef(Component));
