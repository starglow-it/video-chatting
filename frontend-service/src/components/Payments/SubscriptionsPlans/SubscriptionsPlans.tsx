import React, {memo, useEffect, useMemo} from "react";
import {useStore} from "effector-react";
import Image from "next/image";
import Backdrop from "@mui/material/Backdrop";
import {Slide} from "@mui/material";
import { ClickAwayListener } from '@mui/base';

import {WiggleLoader} from "@library/common/WiggleLoader/WiggleLoader";
import {SubscriptionPlanItem} from "@components/Payments/SubscriptionsPlans/SubscriptionPlanItem";

import {CustomGrid} from "@library/custom/CustomGrid/CustomGrid";
import {CustomTypography} from "@library/custom/CustomTypography/CustomTypography";
import {
    $productsStore,
    getStripeProductsFx
} from "../../../store";
import {SubscriptionsPlansProps} from "@components/Payments/SubscriptionsPlans/types";

const Component = ({ isSubscriptionStep, onChooseSubscription, isDisabled, activePlanKey = "House", onClose }: SubscriptionsPlansProps) => {
    const products = useStore($productsStore);
    const isProductsLoading = useStore(getStripeProductsFx.pending);

    useEffect(() => {
        (async () => {
            if (isSubscriptionStep && !products.length) {
                await getStripeProductsFx();
            }
        })();
    }, [isSubscriptionStep, products.length]);

    const handleChosenSubscription = async (productId: string, isPaid: boolean) => {
        onChooseSubscription(productId, isPaid);
    }

    const renderSubscriptionPlans = useMemo(() => products.map((product, i) => (
            <Slide
                key={product?.product?.name}
                in
                timeout={i * 200}
            >
                <SubscriptionPlanItem
                    activePlanKey={activePlanKey}
                    product={product?.product}
                    price={product?.price}
                    onChooseSubscription={handleChosenSubscription}
                    isDisabled={isDisabled}
                />
            </Slide>
    )), [products, isDisabled, activePlanKey]);

    const handleClose = () => {
        onClose?.();
    }

    return (
        <Backdrop
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isSubscriptionStep}
        >
            {isProductsLoading
                ? (
                    <WiggleLoader />
                )
                : null
            }
            {products.length && isSubscriptionStep
                ? (
                    <ClickAwayListener onClickAway={handleClose}>
                        <CustomGrid container direction="column" justifyContent="center" gap={4}>
                            <CustomGrid container justifyContent="center" alignItems="center" gap={1}>
                                <Image src="/images/winking-face.png" width="30px" height="30px" />
                                <CustomTypography
                                    variant="h2bold"
                                    nameSpace="subscriptions"
                                    color="colors.white.primary"
                                    translation="subscriptions.selectPlan"
                                />
                            </CustomGrid>
                            <CustomGrid container gap={2} justifyContent="center" alignItems="center">
                                {renderSubscriptionPlans}
                            </CustomGrid>
                        </CustomGrid>
                    </ClickAwayListener>
                )
                : null
            }
        </Backdrop>
    );
}

export const SubscriptionsPlans = memo(Component);