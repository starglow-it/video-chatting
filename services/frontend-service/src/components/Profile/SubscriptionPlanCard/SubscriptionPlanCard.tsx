import React, { memo, useCallback, useMemo } from 'react';
import { Trans } from 'react-i18next';
import clsx from 'clsx';
import { List, ListItem, ListItemIcon } from '@mui/material';

// hooks
import { useLocalization } from '@hooks/useTranslation';

// custom
import { CustomGrid } from 'shared-frontend/library';
import { CustomButton, CustomBox } from 'shared-frontend/library';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';

// common
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// icons
import { RoundCheckIcon } from 'shared-frontend/icons';

// const
import { CustomImage } from 'shared-frontend/library';
import { Translation } from '@library/common/Translation/Translation';
import { currencies, planColors } from '../../../const/profile/subscriptions';

// shared

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
}: SubscriptionPlanCardProps) => {
    const isFree = price.unit_amount === 0;

    const priceString = !isFree
        ? `${currencies[price?.currency]}${price.unit_amount / 100}`
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
                        <CustomTypography>
                            <Trans>{feature.text}</Trans>
                        </CustomTypography>
                        <CustomTypography variant="body2" color="colors.grayscale.normal">
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
            <CustomGrid container item flex={1} direction="column" className={styles.column}>
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
                        <CustomTypography>/ {price?.recurring?.interval}</CustomTypography>
                    </ConditionalRender>
                </CustomGrid>
                <CustomGrid
                    item
                    container
                    alignItems="center"
                    className={styles.productName}
                    sx={{ backgroundColor: planColors[product.name.replace(' ', '') as string] }}
                >
                    <CustomTypography variant="body3bold" color="colors.white.primary">
                        {product.name}
                    </CustomTypography>
                </CustomGrid>
            </CustomGrid>

            {renderFeaturesListItems}
            <ConditionalRender condition={(!isFree && !isActive) || withTrial}>
                <CustomGrid container gap={1.5} className={styles.buttons}>
                    <ConditionalRender condition={!isFree && !isActive}>
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
                </CustomGrid>
            </ConditionalRender>
        </CustomGrid>
    );
};

export const SubscriptionPlanCard = memo(Component);
