import { useMemo, ForwardedRef, memo, forwardRef } from "react";
import {Trans} from "react-i18next";
import clsx from "clsx";
import {List, ListItem, ListItemIcon} from "@mui/material";

// hooks
import {useLocalization} from "../../../hooks/useTranslation";
import {useToggle} from "../../../hooks/useToggle";

// custom
import { CustomPaper} from "@library/custom/CustomPaper/CustomPaper";
import { CustomTypography} from "@library/custom/CustomTypography/CustomTypography";
import { CustomGrid } from "@library/custom/CustomGrid/CustomGrid";
import { CustomBox} from "@library/custom/CustomBox/CustomBox";
import { CustomButton } from "@library/custom/CustomButton/CustomButton";

// icons
import {RoundCheckIcon} from "@library/icons/RoundIcons/RoundCheckIcon";

// styles
import styles from './SubscriptionsPlans.module.scss';

// const
import {currencies, planColors} from "src/const/profile/subscriptions";

// types
import {SubscriptionPlanItemProps} from "./types";

const Component = ({ product, price, onChooseSubscription, isDisabled, activePlanKey }: SubscriptionPlanItemProps, ref: ForwardedRef<HTMLDivElement>) => {
    const isFree = price.unit_amount === 0;

    const {
        value: isShowMore,
        onToggleSwitch: handleToggleShowMore,
    } = useToggle(false);

    const handleChooseSubscription = () => {
        if (product.name !== activePlanKey) {
            onChooseSubscription(product.id, !isFree);
        }
    }

    const { translation } = useLocalization('subscriptions');

    const priceString = !isFree
        ? `${currencies[price?.currency]}${price.unit_amount / 100}`
        : "FREE";

    const templateFeaturesText = translation(`subscriptions.${product.name}`);

    const renderFeaturesListItems = useMemo(() => templateFeaturesText?.[`${isShowMore ? "more" : "features"}`]?.map((feature, i) => (
        <ListItem key={i} alignItems="center" disablePadding className={styles.listItem}>
            <ListItemIcon classes={{ root: styles.listIcon }}>
                <RoundCheckIcon width="20px" height="20px" />
            </ListItemIcon>
            <CustomGrid container direction="column">
                <CustomTypography variant="body2">
                    <Trans>
                        {feature.text}
                    </Trans>
                </CustomTypography>
                <CustomTypography variant="body2" color="colors.grayscale.normal">
                    {feature.subText}
                </CustomTypography>
            </CustomGrid>
        </ListItem>
    )), [isShowMore]);

    const isActive = activePlanKey === product.name;

    return (
        <CustomPaper ref={ref} className={styles.wrapper}>
            <CustomGrid container direction="column" wrap="nowrap">
                <CustomBox className={styles.productName} sx={{ backgroundColor: planColors[product.name as string] }}>
                    <CustomTypography variant="body1bold" color="colors.white.primary">
                        {product.name}
                    </CustomTypography>
                </CustomBox>
                <CustomGrid className={styles.priceWrapper}>
                    <CustomTypography className={styles.price}>
                        {priceString}
                    </CustomTypography>
                    {!isFree
                        ? (
                            <CustomTypography>
                                / {price?.recurring?.interval}
                            </CustomTypography>
                        )
                        : null
                    }
                </CustomGrid>

                <CustomTypography variant="body1">
                    {product.description}
                </CustomTypography>

                <List className={styles.listWrapper}>
                    {renderFeaturesListItems}
                </List>

                {templateFeaturesText?.more?.length && (
                    <CustomTypography
                        onClick={handleToggleShowMore}
                        className={styles.expandBtn}
                        color="colors.blue.primary"
                        nameSpace="common"
                        translation={isShowMore ? 'hide' : 'more'}
                    />
                )}

                <CustomButton
                    variant="custom-black"
                    nameSpace="subscriptions"
                    disabled={isDisabled}
                    translation={isActive ? "buttons.currentPlan" : `buttons.start${product.name}`}
                    onClick={handleChooseSubscription}
                    className={clsx(styles.button, {[styles.active]: isActive})}
                />
            </CustomGrid>
        </CustomPaper>
    )
}

export const SubscriptionPlanItem = memo(forwardRef(Component));