import React, { memo, useCallback, useEffect } from 'react';
import { useStore } from 'effector-react';

// icons
import { MonetizationIcon } from 'shared-frontend/icons/OtherIcons/MonetizationIcon';
import { StripeIcon } from 'shared-frontend/icons/OtherIcons/StripeIcon';
import { ArrowIcon } from 'shared-frontend/icons/OtherIcons/ArrowIcon';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// custom
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// common
import { SocialLogin } from '@library/common/SocialLogin/SocialLogin';
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';

// styles
import styles from './MeetingConnectStripe.module.scss';

// stores
import {
    $profileStore,
    addNotificationEvent,
    connectStripeAccountFx,
    deleteStripeAccountFx,
    loginStripeAccountFx,
    updateProfileFx,
} from '../../../store';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';



export const MeetingConnectStripe = () => {
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
  return (
        profile.isStripeEnabled && profile.stripeAccountId ? (
            <CustomButton className={styles.buttonWrapper} onClick={handleLoginStripe}>
                <CustomTypography className={styles.email}>
                    Disconnect Stripe
                </CustomTypography>
            </CustomButton>
        ) : (
            <CustomGrid container gap={2} direction="column">
                <CustomButton onClick={handleSetUpPayments} >
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
                        <CustomLoader />
                    )}
                </CustomButton>
            </CustomGrid>
        )
  )
}