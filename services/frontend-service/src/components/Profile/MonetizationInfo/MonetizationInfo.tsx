import React, { memo, useCallback, useEffect } from 'react';
import { useStore } from 'effector-react';

// icons
import { MonetizationIcon } from '@library/icons/MonetizationIcon';
import { StripeIcon } from '@library/icons/StripeIcon';
import { ArrowIcon } from '@library/icons/ArrowIcon';

// custom
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// common
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';
import { SocialLogin } from '@library/common/SocialLogin/SocialLogin';
import { WiggleLoader } from '@library/common/WiggleLoader/WiggleLoader';

// styles
import styles from './MonetizationInfo.module.scss';

// stores
import {
    $profileStore,
    addNotificationEvent,
    connectStripeAccountFx,
    deleteStripeAccountFx,
    loginStripeAccountFx,
    updateProfileFx,
} from '../../../store';

import { NotificationType } from '../../../store/types';
import { emptyFunction } from '../../../utils/functions/emptyFunction';

const MonetizationInfo = memo(() => {
    const profile = useStore($profileStore);
    const isConnectStripeAccountPending = useStore(connectStripeAccountFx.pending);
    const isLoginStripeAccountPending = useStore(loginStripeAccountFx.pending);
    const isDeleteStripeAccountPending = useStore(deleteStripeAccountFx.pending);

    const handleSetUpPayments = useCallback(async () => {
        if (!isConnectStripeAccountPending) {
            await connectStripeAccountFx({});
        }
    }, [isConnectStripeAccountPending]);

    const handleLoginStripe = useCallback(async () => {
        if (!isLoginStripeAccountPending) loginStripeAccountFx();
    }, []);

    const handleDeletePaymentSetUp = useCallback(async () => {
        await deleteStripeAccountFx({});
    }, []);

    useEffect(() => {
        if (profile.isStripeEnabled && !profile.wasSuccessNotificationShown) {
            addNotificationEvent({
                type: NotificationType.PaymentSuccess,
                message: 'payments.connectAccountSuccess',
                withSuccessIcon: true,
            });
            updateProfileFx({
                wasSuccessNotificationShown: true,
            });
        }
    }, [profile.isStripeEnabled, profile.wasSuccessNotificationShown]);

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
                <ConditionalRender condition={Boolean(profile.stripeAccountId)}>
                    <CustomTypography
                        className={styles.disconnect}
                        onClick={
                            !isDeleteStripeAccountPending ? handleDeletePaymentSetUp : emptyFunction
                        }
                        color={
                            !isDeleteStripeAccountPending
                                ? 'colors.red.primary'
                                : 'colors.grayscale.normal'
                        }
                        nameSpace="profile"
                        translation="monetization.disconnect"
                    />
                </ConditionalRender>
            </CustomGrid>
            <ConditionalRender
                condition={!profile.isStripeEnabled && Boolean(profile.stripeAccountId)}
            >
                <CustomTypography
                    color="colors.grayscale.normal"
                    nameSpace="profile"
                    translation="monetization.setUpStripeText"
                />
            </ConditionalRender>
            <CustomGrid container gap={6}>
                {profile.isStripeEnabled && profile.stripeAccountId ? (
                    <SocialLogin className={styles.buttonWrapper} onClick={handleLoginStripe}>
                        <CustomTypography
                            variant="body1bold"
                            nameSpace="profile"
                            translation="monetization.stripe"
                        />
                        :
                        <CustomTypography className={styles.email}>
                            &nbsp;
                            {profile.stripeEmail}
                        </CustomTypography>
                        <ArrowIcon width="28px" height="28px" className={styles.icon} />
                    </SocialLogin>
                ) : (
                    <CustomGrid container gap={2} direction="column">
                        <SocialLogin Icon={StripeIcon} onClick={handleSetUpPayments}>
                            {!isConnectStripeAccountPending ? (
                                <>
                                    &nbsp;
                                    <CustomTypography
                                        nameSpace="profile"
                                        translation={
                                            !profile.isStripeEnabled && profile.stripeAccountId
                                                ? 'monetization.setUp'
                                                : 'monetization.connectWith'
                                        }
                                    />
                                    &nbsp;
                                    <CustomTypography
                                        variant="body1bold"
                                        nameSpace="profile"
                                        translation="monetization.stripe"
                                    />
                                </>
                            ) : (
                                <WiggleLoader />
                            )}
                        </SocialLogin>
                    </CustomGrid>
                )}
            </CustomGrid>
        </CustomGrid>
    );
});

export { MonetizationInfo };
