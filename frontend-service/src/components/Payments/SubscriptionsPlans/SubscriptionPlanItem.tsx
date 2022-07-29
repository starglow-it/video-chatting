import { useMemo, ForwardedRef, memo, forwardRef } from "react";

import { CustomPaper} from "@library/custom/CustomPaper/CustomPaper";
import { CustomTypography} from "@library/custom/CustomTypography/CustomTypography";
import { CustomGrid } from "@library/custom/CustomGrid/CustomGrid";
import { CustomBox} from "@library/custom/CustomBox/CustomBox";
import { CustomButton } from "@library/custom/CustomButton/CustomButton";

import styles from './SubscriptionsPlans.module.scss';
import {useLocalization} from "../../../hooks/useTranslation";
import {List, ListItem, ListItemIcon} from "@mui/material";
import {RoundCheckIcon} from "@library/icons/RoundIcons/RoundCheckIcon";
import {Trans} from "react-i18next";

const planColors: Record<string, string> = {
    "House": "#69E071",
    "Professional": "#2E6DF2",
    "Business": "#FF884E"
}

const currencies: Record<string, string> = {
    "cad": "C$",
    "usd": "$"
}

const Component = ({ product, price, onChooseSubscription, isDisabled }: { isDisabled: boolean; product: any, price: any; onChooseSubscription: (productId: string, isPaid: boolean) => void }, ref: ForwardedRef<HTMLDivElement>) => {
    const isFree = price.unit_amount === 0;

    const handleChooseSubscription = () => {
        onChooseSubscription(product.id, !isFree);
    }

    const { translation } = useLocalization('subscriptions');

    const priceString = !isFree
        ? `${currencies[price?.currency]}${price.unit_amount / 100}`
        : "FREE";

    const renderFeaturesListItems = useMemo(() => {
        return translation(`subscriptions.${product.name}`)?.features?.map((feature) => {
            return (
                <ListItem alignItems="center" disablePadding className={styles.listItem}>
                    <ListItemIcon classes={{ root: styles.listIcon }}>
                        <RoundCheckIcon width="20px" height="20px" />
                    </ListItemIcon>
                    <CustomGrid container direction="column">
                        <CustomTypography varian="body2">
                            <Trans i18nKey="userMessagesUnread">
                                {feature.text}
                            </Trans>
                        </CustomTypography>
                        <CustomTypography variant="body2" color="colors.grayscale.normal">
                            {feature.subText}
                        </CustomTypography>
                    </CustomGrid>
                </ListItem>
            )
        });
    }, []);

    return (
        <CustomPaper ref={ref} className={styles.wrapper}>
            <CustomGrid container direction="column" className={styles.content} wrap="nowrap">
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

                <CustomButton
                    variant="custom-black"
                    nameSpace="templates"
                    disabled={isDisabled}
                    translation={`setUpSpace.subscriptions.start${product.name}`}
                    onClick={handleChooseSubscription}
                />
            </CustomGrid>
        </CustomPaper>
    )
}

export const SubscriptionPlanItem = memo(forwardRef(Component));