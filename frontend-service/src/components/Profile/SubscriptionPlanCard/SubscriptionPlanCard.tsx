import {memo, useMemo} from "react"
import {Trans} from "react-i18next";
import clsx from "clsx";
import {List, ListItem, ListItemIcon} from "@mui/material";

// hooks
import {useLocalization} from "../../../hooks/useTranslation";

// custom
import {CustomGrid} from "@library/custom/CustomGrid/CustomGrid";
import { CustomButton } from "@library/custom/CustomButton/CustomButton";
import {CustomTypography} from "@library/custom/CustomTypography/CustomTypography";
import {CustomBox} from "@library/custom/CustomBox/CustomBox";

// icons
import {RoundCheckIcon} from "@library/icons/RoundIcons/RoundCheckIcon";

// const
import {currencies, planColors} from "../../../const/profile/subscriptions";

// styles
import styles from './SubscriptionPlanCard.module.scss';

// types
import {SubscriptionPlanCardProps} from "./types";

const Component = ({ product, price, activePlanKey = "House", onOpenPlans, onChooseSubscription, isDisabled }: SubscriptionPlanCardProps) => {
    const isFree = price.unit_amount === 0;
    const isActive = activePlanKey === product.name;

    const priceString = !isFree
        ? `${currencies[price?.currency]}${price.unit_amount / 100}`
        : "Free";

    const { translation } = useLocalization('subscriptions');

    const renderFeaturesListItems = useMemo(() => translation(`subscriptions.${product.name}`)?.features?.map((feature, i) => (
        <ListItem key={i} alignItems="flex-start" disablePadding className={styles.listItem}>
            <ListItemIcon classes={{ root: styles.listIcon }}>
                <RoundCheckIcon width="20px" height="20px" />
            </ListItemIcon>
            <CustomGrid container direction="column">
                <CustomTypography>
                    <Trans>
                        {feature.text}
                    </Trans>
                </CustomTypography>
                <CustomTypography variant="body2" color="colors.grayscale.normal">
                    {feature.subText}
                </CustomTypography>
            </CustomGrid>
        </ListItem>
    )), []);

    const handleChooseSubscription = () => {
        onChooseSubscription?.(product.id, !isFree);
    }

    return (
        <CustomGrid container direction="column" wrap="nowrap" className={clsx(styles.wrapper, {[styles.active]: isActive })}>
            <CustomGrid container direction="column" className={styles.info}>
                <CustomBox className={styles.productName} sx={{ backgroundColor: planColors[product.name as string] }}>
                    <CustomTypography variant="body3" color="colors.white.primary">
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
                <CustomGrid container className={styles.buttons} gap={1.5}>
                    <CustomButton
                        variant="custom-cancel"
                        onClick={onOpenPlans}
                        className={styles.button}
                        nameSpace="subscriptions"
                        translation="buttons.showMore"
                    />
                    {!isFree && !isActive ? (
                        <CustomButton
                            disabled={isDisabled}
                            onClick={handleChooseSubscription}
                            className={styles.button}
                            nameSpace="subscriptions"
                            translation="buttons.upgrade"
                        />
                        )
                        : null
                    }
                </CustomGrid>
            </CustomGrid>

            <List className={styles.listWrapper}>
                {renderFeaturesListItems}
            </List>
        </CustomGrid>
    )
}

export const SubscriptionPlanCard = memo(Component)