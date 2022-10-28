import React, { memo, useCallback, useMemo } from 'react';
import { Trans } from 'react-i18next';
import clsx from 'clsx';
import { List, ListItem, ListItemIcon } from '@mui/material';

// hooks
import { useLocalization } from '@hooks/useTranslation';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// common
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// icons
import { RoundCheckIcon } from '@library/icons/RoundIcons/RoundCheckIcon';

// const
import { currencies, planColors } from '../../../const/profile/subscriptions';

// shared
import { CustomImage } from 'shared-frontend/library';

// styles
import styles from './SubscriptionPlanCard.module.scss';

// types
import { SubscriptionPlanCardProps } from './types';

const Component = ({
    product,
    price,
    activePlanKey = 'House',
    onOpenPlans,
    onChooseSubscription,
    isDisabled,
    withTrial = false,
}: SubscriptionPlanCardProps) => {
    const isFree = price.unit_amount === 0;
    const isActive = activePlanKey === product.name;

    const priceString = !isFree
        ? `${currencies[price?.currency]}${price.unit_amount / 100}`
        : 'FREE';

    const { translation } = useLocalization('subscriptions');

    const renderFeaturesListItems = useMemo(() => {
        const translationsObject = translation(`subscriptions.${product.name}`) as unknown as {
            features: { key: string; text: string; subText: string }[];
        };

        return translationsObject?.features?.map(feature => (
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
                    <CustomTypography>
                        <Trans>{feature.text}</Trans>
                    </CustomTypography>
                    <CustomTypography variant="body2" color="colors.grayscale.normal">
                        {feature.subText}
                    </CustomTypography>
                </CustomGrid>
            </ListItem>
        ));
    }, []);

    const handleChooseSubscription = useCallback(() => {
        onChooseSubscription?.(product.id, !isFree, false);
    }, [onChooseSubscription, product.id, isFree]);

    const handleChooseTrial = useCallback(() => {
        onChooseSubscription?.(product.id, !isFree, true);
    }, [onChooseSubscription, product.id, isFree]);

    return (
        <CustomGrid
            container
            direction="column"
            wrap="nowrap"
            className={clsx(styles.wrapper, { [styles.active]: isActive })}
        >
            <CustomGrid container direction="column" className={styles.info}>
                <CustomBox
                    className={styles.productName}
                    sx={{ backgroundColor: planColors[product.name as string] }}
                >
                    <CustomTypography variant="body3" color="colors.white.primary">
                        {product.name}
                    </CustomTypography>
                </CustomBox>
                <CustomGrid className={styles.priceWrapper}>
                    <CustomTypography className={styles.price}>{priceString}</CustomTypography>
                    <ConditionalRender condition={!isFree}>
                        <CustomTypography>/ {price?.recurring?.interval}</CustomTypography>
                    </ConditionalRender>
                </CustomGrid>
                <CustomGrid container className={styles.buttons} gap={1.5}>
                    <CustomButton
                        variant="custom-cancel"
                        onClick={onOpenPlans}
                        className={styles.button}
                        nameSpace="subscriptions"
                        translation="buttons.showMore"
                    />
                    <ConditionalRender condition={!isFree && !isActive}>
                        <CustomButton
                            disabled={isDisabled}
                            onClick={handleChooseSubscription}
                            className={styles.button}
                            nameSpace="subscriptions"
                            translation="buttons.upgrade"
                        />
                    </ConditionalRender>
                </CustomGrid>
            </CustomGrid>

            <List className={styles.listWrapper}>{renderFeaturesListItems}</List>

            <ConditionalRender condition={translation(`subscriptions.${product.name}`).trial}>
                <CustomTypography
                    dangerouslySetInnerHTML={{
                        __html: translation(`subscriptions.${product.name}.trial`),
                    }}
                    className={styles.trialText}
                />
            </ConditionalRender>
            <ConditionalRender condition={withTrial}>
                <CustomButton
                    variant="custom-black"
                    nameSpace="subscriptions"
                    translation="buttons.tryForFree"
                    onClick={handleChooseTrial}
                    className={styles.trialButton}
                    Icon={
                        <CustomBox className={styles.icon}>
                            <CustomImage
                                src="/images/ok-hand.png"
                                width="18px"
                                height="18px"
                                alt="ok-hand"
                            />
                        </CustomBox>
                    }
                />
            </ConditionalRender>
        </CustomGrid>
    );
};

export const SubscriptionPlanCard = memo(Component);
