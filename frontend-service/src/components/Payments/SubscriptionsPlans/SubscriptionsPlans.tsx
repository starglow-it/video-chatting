import React, {memo, useEffect, useMemo} from "react";
import {useRouter} from "next/router";
import {useStore} from "effector-react";
import Image from "next/image";
import Backdrop from "@mui/material/Backdrop";
import {Slide} from "@mui/material";

import {
    $productsStore, $setUpTemplateStore,
    createMeetingFx,
    getStripeProductsFx,
    startCheckoutSessionForSubscriptionFx
} from "../../../store";

import {WiggleLoader} from "@library/common/WiggleLoader/WiggleLoader";
import {SubscriptionPlanItem} from "@components/Payments/SubscriptionsPlans/SubscriptionPlanItem";

import {CustomGrid} from "@library/custom/CustomGrid/CustomGrid";
import {CustomTypography} from "@library/custom/CustomTypography/CustomTypography";

const Component = ({ isSubscriptionStep }: { isSubscriptionStep: boolean }) => {
    const router = useRouter();

    const setUpTemplate = useStore($setUpTemplateStore);
    const products = useStore($productsStore);

    const isCreateMeetingPending = useStore(createMeetingFx.pending);
    const isProductsLoading = useStore(getStripeProductsFx.pending);
    const isSubscriptionPurchasePending = useStore(startCheckoutSessionForSubscriptionFx.pending);

    useEffect(() => {
        (async () => {
            if (isSubscriptionStep) {
                await getStripeProductsFx();
            }
        })();
    }, [isSubscriptionStep]);

    const handleChosenSubscription = async (productId: string, isPaid: boolean) => {
        const result = await createMeetingFx({ templateId: setUpTemplate?.id! });

        if (result.template && isPaid) {
            const response = await startCheckoutSessionForSubscriptionFx({ productId, meetingToken: result.template.id });

            if (response?.url) {
                return router.push(response.url);
            }
        } else if (result.template) {
            await router.push(`/meeting/${result.template.id}`);
        }
    }

    const renderSubscriptionPlans = useMemo(() => products.map((product, i) => {
        return (
            <Slide
                key={product?.product?.name}
                in
                timeout={i * 200}
            >
                <SubscriptionPlanItem
                    product={product?.product}
                    price={product?.price}
                    onChooseSubscription={handleChosenSubscription}
                    isDisabled={isSubscriptionPurchasePending || isCreateMeetingPending}
                />
            </Slide>
        );
    }), [products, isSubscriptionPurchasePending]);

    return (
            <Backdrop
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isSubscriptionStep}
            >
                {(isProductsLoading || !products.length)
                    ? (
                        <WiggleLoader />
                    )
                    : (
                        <CustomGrid container direction="column" justifyContent="center" gap={4}>
                            <CustomGrid container justifyContent="center" alignItems="center" gap={1}>
                                <Image src="/images/winking-face.png" width="30px" height="30px" />
                                <CustomTypography
                                    variant="h2bold"
                                    nameSpace="templates"
                                    color="colors.white.primary"
                                    translation="setUpSpace.selectPlan"
                                />
                            </CustomGrid>
                            <CustomGrid container gap={2} justifyContent="center" alignItems="center">
                                {renderSubscriptionPlans}
                            </CustomGrid>
                        </CustomGrid>
                    )
                }
            </Backdrop>
    );
}

export const SubscriptionsPlans = memo(Component);