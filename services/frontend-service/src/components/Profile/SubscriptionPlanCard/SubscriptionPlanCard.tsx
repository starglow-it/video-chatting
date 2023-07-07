import React, { memo, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { List, ListItem, ListItemIcon } from '@mui/material';

// hooks
import { useLocalization } from '@hooks/useTranslation';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { RoundCheckIcon } from 'shared-frontend/icons/RoundIcons/RoundCheckIcon';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import { Translation } from '@library/common/Translation/Translation';

// const
import { planColors } from 'shared-const';
import { currencies } from '../../../const/profile/subscriptions';

// styles
import styles from './SubscriptionPlanCard.module.scss';

// types
import { SubscriptionPlanCardProps, TranslationFeatureItem } from './types';

const Component = ({
    product,
    price,
    isActive = false,
    isHighlighted,
    onChooseSubscription,
    isDisabled,
    withTrial = false,
    priceLabel,
    isTrial = false,
}: SubscriptionPlanCardProps) => {
    const isFree = price?.unit_amount === 0;

    const priceString = !isFree
        ? `${currencies[price?.currency]}${price?.unit_amount / 100}`
        : 'Free';

    const { translation } = useLocalization('subscriptions');

    const renderListItem = useCallback(
        (features: TranslationFeatureItem[]) =>
            features?.map(feature => (
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
                        <CustomTypography
                            dangerouslySetInnerHTML={{
                                __html: feature.text,
                            }}
                        />
                        <CustomTypography
                            variant="body2"
                            color="colors.grayscale.normal"
                        >
                            {feature.subText}
                        </CustomTypography>
                    </CustomGrid>
                </ListItem>
            )),
        [],
    );

    const renderFeaturesListItems = useMemo(() => {
        const translationsObject = translation(
            `subscriptions.${product.name.replace(' ', '')}`,
        ) as unknown as {
            features: TranslationFeatureItem[][];
        };

        const columns = translationsObject?.features.map(column => (
            <CustomGrid
                container
                item
                flex={1}
                direction="column"
                className={styles.column}
            >
                {renderListItem(column)}
            </CustomGrid>
        ));

        return <List className={styles.listWrapper}>{columns}</List>;
    }, [renderListItem]);

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
            className={clsx(styles.wrapper, {
                [styles.active]: isActive,
                [styles.highlighted]: isHighlighted,
            })}
        >
            <CustomGrid
                container
                alignItems="flex-start"
                justifyContent="space-between"
                className={styles.info}
            >
                <CustomGrid className={styles.priceWrapper}>
                    <CustomTypography className={styles.price}>
                        {priceLabel ? translation(priceLabel) : priceString}
                    </CustomTypography>
                    <ConditionalRender condition={!isFree}>
                        <CustomTypography>
                            / {price?.recurring?.interval}
                        </CustomTypography>
                    </ConditionalRender>
                </CustomGrid>
                <CustomGrid
                    item
                    container
                    alignItems="center"
                    className={styles.productName}
                    sx={{
                        backgroundColor:
                            planColors[product.name.replace(' ', '') as string],
                    }}
                >
                    <CustomTypography
                        variant="body3bold"
                        color="colors.white.primary"
                    >
                        {product.name}
                    </CustomTypography>
                </CustomGrid>
            </CustomGrid>

            {renderFeaturesListItems}
            <ConditionalRender condition={(!isFree && !isActive) || isTrial}>
                <CustomGrid container gap={1.5} className={styles.buttons}>
                    <ConditionalRender
                        condition={(!isFree && !isActive) || isTrial}
                    >
                        <CustomButton
                            disabled={isDisabled}
                            onClick={handleChooseSubscription}
                            label={
                                <Translation
                                    nameSpace="subscriptions"
                                    translation={`buttons.upgradeTo${product.name}`}
                                />
                            }
                            className={styles.button}
                        />
                    </ConditionalRender>
                    <ConditionalRender condition={withTrial}>
                        <CustomTooltip
                            arrow
                            title={
                                <CustomTypography
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            translation(
                                                `subscriptions.${product.name}.trialHint`,
                                            ) ?? '',
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
                                            src="/images/ok-hand.webp"
                                            width="20px"
                                            height="20px"
                                            alt="ok-hand"
                                        />
                                    </CustomBox>
                                }
                            />
                        </CustomTooltip>
                    </ConditionalRender>
                </CustomGrid>
            </ConditionalRender>
        </CustomGrid>
    );
};

export const SubscriptionPlanCard = memo(Component);
