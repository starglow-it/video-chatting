import React, { memo, useCallback } from 'react';
import {useStore} from "effector-react";

// icons
import { MonetizationIcon } from '@library/icons/MonetizationIcon';
import { StripeIcon } from "@library/icons/StripeIcon";
import {ArrowIcon} from "@library/icons/ArrowIcon";

// custom
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// components
import { SocialLogin } from "@library/common/SocialLogin/SocialLogin";
import {WiggleLoader} from "@library/common/WiggleLoader/WiggleLoader";

// styles
import styles from './MonetizationInfo.module.scss';

// stores
import {
    $profileStore,
    connectStripeAccountFx,
    deleteStripeAccountFx,
    loginStripeAccountFx
} from "../../../store";

const MonetizationInfo = memo(() => {
    const profile = useStore($profileStore);
    const isConnectStripeAccountPending = useStore(connectStripeAccountFx.pending);
    const isLoginStripeAccountPending = useStore(loginStripeAccountFx.pending);

    const handleSetUpPayments = useCallback(async () => {
        if (!isConnectStripeAccountPending) {
            await connectStripeAccountFx({});
        }
    }, [isConnectStripeAccountPending]);

    const handleDeletePaymentSetUp = useCallback(async () => {
        await deleteStripeAccountFx({});
    }, []);

    const handleLoginStripe = useCallback(async () => {
        if (!isLoginStripeAccountPending) loginStripeAccountFx();
    }, []);

    return (
        <CustomGrid
            container
            direction="column"
            alignItems="center"
            className={styles.monetizationWrapper}
            gap={2}
        >
            <CustomGrid container alignItems="center" wrap="nowrap">
                <MonetizationIcon className={styles.monetizationIcon} width="24px" height="24px" />
                <CustomTypography
                    fontWeight={600}
                    nameSpace="profile"
                    translation="monetization.title"
                />
                {profile.stripeAccountId
                    ? (
                        <CustomTypography
                            className={styles.disconnect}
                            onClick={handleDeletePaymentSetUp}
                            color="colors.red.primary"
                            nameSpace="profile"
                            translation="monetization.disconnect"
                        />
                    )
                    : null
                }
            </CustomGrid>
            <CustomGrid container gap={6}>
                {profile.stripeAccountId ? (
                    <SocialLogin
                        className={styles.buttonWrapper}
                        onClick={handleLoginStripe}
                    >
                        <CustomTypography variant="body1bold" nameSpace="profile" translation="monetization.stripe" />
                        :
                        <CustomTypography className={styles.email}>
                            &nbsp;
                            {profile.stripeEmail}
                        </CustomTypography>
                        <ArrowIcon width="28px" height="28px" className={styles.icon} />
                    </SocialLogin>
                ) : (
                    <CustomGrid container gap={2} direction="column">
                        <SocialLogin
                            Icon={StripeIcon}
                            onClick={handleSetUpPayments}
                        >
                            {!isConnectStripeAccountPending
                                ? (
                                    <>
                                        &nbsp;
                                        <CustomTypography nameSpace="profile" translation="monetization.connectWith" />
                                        &nbsp;
                                        <CustomTypography variant="body1bold" nameSpace="profile" translation="monetization.stripe" />
                                    </>
                                )
                                : <WiggleLoader />
                            }
                        </SocialLogin>
                    </CustomGrid>
                )}
            </CustomGrid>
        </CustomGrid>
    );
});

export { MonetizationInfo };
