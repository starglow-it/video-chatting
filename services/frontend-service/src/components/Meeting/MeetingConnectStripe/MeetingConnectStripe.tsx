import { useCallback, useMemo } from 'react';
import { useStore } from 'effector-react';

// icons
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// custom
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// common
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';

// styles
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import styles from './MeetingConnectStripe.module.scss';

// stores
import {
    $isPortraitLayout,
    $profileStore,
    connectStripeAccountFx,
    deleteStripeAccountFx,
} from '../../../store';

export const MeetingConnectStripe = () => {
    const profile = useStore($profileStore);
    const isConnectStripeAccountPending = useStore(
        connectStripeAccountFx.pending,
    );
    const isDeleteStripeAccountPending = useStore(
        deleteStripeAccountFx.pending,
    );
    const isPortraitLayout = useStore($isPortraitLayout);

    const handleSetUpPayments = useCallback(async () => {
        if (!isConnectStripeAccountPending) {
            await connectStripeAccountFx({});
        }
    }, [isConnectStripeAccountPending]);

    const handleDeletePaymentSetUp = useCallback(async () => {
        if (!isDeleteStripeAccountPending) {
            await deleteStripeAccountFx({});
        }
    }, []);

    const fontSize = useMemo(() => {
        if (isPortraitLayout) return 12;
        return undefined;
    }, [isPortraitLayout]);

    return profile.isStripeEnabled && profile.stripeAccountId ? (
        <CustomButton
            className={styles.buttonWrapper}
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
            />
        </CustomButton>
    ) : (
        <CustomGrid container gap={2} direction="column">
            <CustomButton onClick={handleSetUpPayments}>
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
