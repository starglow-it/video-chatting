import React, { useMemo, ForwardedRef, memo, forwardRef, useCallback } from 'react';
import clsx from 'clsx';
import { List, ListItem, ListItemIcon } from '@mui/material';

// hooks
import { useToggle } from '@hooks/useToggle';
import { useLocalization } from '@hooks/useTranslation';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';

// common
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// icons
import { RoundCheckIcon } from '@library/icons/RoundIcons/RoundCheckIcon';

// shared
import { CustomImage } from 'shared-frontend/library';

// styles
import { currencies, planColors } from 'src/const/profile/subscriptions';

// types
import { SubscriptionPlanItemProps } from './types';

// styles
import styles from './SubscriptionsPlans.module.scss';

const Component = (
    {
        product,
        price,
        onChooseSubscription,
        isDisabled,
        activePlanKey,
        buttonTranslation = 'buttons.start',
        withTrial = false,
    }: SubscriptionPlanItemProps,
    ref: ForwardedRef<HTMLDivElement>,
) => {
    const isFree = price.unit_amount === 0;

    const { value: isShowMore, onToggleSwitch: handleToggleShowMore } = useToggle(false);

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
        more: { key: string; text: string; subText: string }[];
        features: { key: string; text: string; subText: string }[];
        trialHint?: string;
    };

    const renderFeaturesListItems = useMemo(() => {
        const translationKey = `${
            isShowMore ? 'more' : 'features'
        }` as keyof typeof templateFeaturesText;

        return templateFeaturesText?.[translationKey]?.map(feature => (
            <ListItem
                key={feature.key}
                alignItems="flex-start"
                disablePadding
                className={styles.listItem}
            >
                <ListItemIcon classes={{ root: styles.listIcon }}>
                    <RoundCheckIcon width="20px" height="20px" />
                </ListItemIcon>
                <CustomGrid container direction="column">
                    <CustomTypography variant="body1">{feature.text}</CustomTypography>
                    <CustomTypography variant="body2">{feature.subText}</CustomTypography>
                </CustomGrid>
            </ListItem>
        ));
    }, [isShowMore]);

    const isActive = activePlanKey === product.name;

    return (
        <CustomPaper ref={ref} className={styles.wrapper}>
            <CustomGrid container direction="column" wrap="nowrap">
                <CustomBox
                    className={styles.productName}
                    sx={{ backgroundColor: planColors[product.name as string] }}
                >
                    <CustomTypography variant="body1bold" color="colors.white.primary">
                        {product.name}
                    </CustomTypography>
                </CustomBox>
                <CustomGrid className={styles.priceWrapper}>
                    <CustomTypography className={styles.price}>{priceString}</CustomTypography>
                    <ConditionalRender condition={!isFree}>
                        <CustomTypography>/ {price?.recurring?.interval}</CustomTypography>
                    </ConditionalRender>
                </CustomGrid>

                <CustomTypography variant="body1">{product.description}</CustomTypography>

                <List className={styles.listWrapper}>
                    <CustomScroll>{renderFeaturesListItems}</CustomScroll>
                </List>

                <ConditionalRender condition={Boolean(templateFeaturesText?.more?.length)}>
                    <CustomTypography
                        onClick={handleToggleShowMore}
                        className={styles.expandBtn}
                        color="colors.blue.primary"
                        nameSpace="subscriptions"
                        translation={`plans.features.${isShowMore ? 'hide' : 'show'}`}
                    />
                </ConditionalRender>

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
                            nameSpace="subscriptions"
                            translation="buttons.tryForFree"
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
                    nameSpace="subscriptions"
                    disabled={isDisabled}
                    translation={
                        isActive ? 'buttons.currentPlan' : `${buttonTranslation}${product.name}`
                    }
                    onClick={handleChooseSubscription}
                    className={clsx(styles.button, { [styles.active]: isActive })}
                />
            </CustomGrid>
        </CustomPaper>
    );
};

export const SubscriptionPlanItem = memo(forwardRef(Component));
