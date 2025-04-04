import { useCallback, useMemo } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';

// icons
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// custom
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// common
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';
import { useBrowserDetect } from 'shared-frontend/hooks/useBrowserDetect';

// styles
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import styles from './MeetingConnectStripe.module.scss';

// stores
import {
    $isConnectedStripe,
    $isPortraitLayout,
    $profileStore,
    connectStripeAccountFx,
    deleteStripeAccountFx,
} from '../../../store';

export const MeetingConnectStripe = () => {
    const profile = useStore($profileStore);
    const isConnectedStripe = useStore($isConnectedStripe);
    const isConnectStripeAccountPending = useStore(
        connectStripeAccountFx.pending,
    );
    const isDeleteStripeAccountPending = useStore(
        deleteStripeAccountFx.pending,
    );
    const isPortraitLayout = useStore($isPortraitLayout);

    const handleSetUpPayments = useCallback(async () => {
        if (!isConnectStripeAccountPending) {
            await connectStripeAccountFx();
        }
    }, [isConnectStripeAccountPending]);

    const handleDeletePaymentSetUp = useCallback(async () => {
        if (!isDeleteStripeAccountPending) {
            await deleteStripeAccountFx();
        }
    }, []);
    const { isMobile } = useBrowserDetect();

    const fontSize = useMemo(() => {
        if (isPortraitLayout) return 12;
        return 14;
    }, [isPortraitLayout]);

    return isConnectedStripe ? (
        <CustomButton
            className={clsx(styles.buttonWrapper, {[styles.mobile]: isMobile})}
            onClick={handleDeletePaymentSetUp}
        >
            <CustomTypography
                className={styles.disconnect}
                color={
                    !isDeleteStripeAccountPending
                        ? 'colors.red.primary'
                        : 'colors.grayscale.normal'
                }
                nameSpace="profile"
                translation="monetization.disconnect"
                fontSize={fontSize}
            />
        </CustomButton>
    ) : (
        <CustomGrid container gap={2} direction="column">
            <CustomButton
                onClick={handleSetUpPayments}
                className={clsx(styles.button, { [styles.mobile]: isMobile })}
            >
                {!isConnectStripeAccountPending ? (
                    <>
                        &nbsp;
                        <CustomTypography
                            nameSpace="profile"
                            translation={
                                !profile.isStripeEnabled &&
                                profile.stripeAccountId
                                    ? 'monetization.setUp'
                                    : 'monetization.connectWith'
                            }
                            fontSize={fontSize}
                        />
                        &nbsp;
                        <CustomTypography
                            variant="body1bold"
                            nameSpace="profile"
                            translation="monetization.stripe"
                            fontSize={fontSize}
                        />
                    </>
                ) : (
                    <CustomLoader />
                )}
            </CustomButton>
        </CustomGrid>
    );
};
