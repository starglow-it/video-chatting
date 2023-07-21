import React, { memo, useCallback, useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { useRouter } from 'next/router';
import { useStore } from 'effector-react';

// hooks
import { useLocalization } from '@hooks/useTranslation';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CloseIcon } from 'shared-frontend/icons/OtherIcons/CloseIcon';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomIconButton } from '@library/custom/CustomIconButton/CustomIconButton';

// styles
import styles from './SubscriptionExpiredNotification.module.scss';

// stores
import {
    $isTrial,
    $productsStore,
    $profileStore,
    getCustomerPortalSessionUrlFx,
    startCheckoutSessionForSubscriptionFx,
    updateProfileFx,
} from '../../store';

// const
import { dashboardRoute } from '../../const/client-routes';

type ComponentProps = unknown;

const Component: React.FunctionComponent<ComponentProps> = () => {
    const router = useRouter();

    const [open, setOpenState] = useState(false);

    const profile = useStore($profileStore);
    const products = useStore($productsStore);
    const isTrial = useStore($isTrial);

    const productFiltered = products.find(
        item => item?.product?.name === 'Professional',
    );
    const { translation } = useLocalization('subscriptions');

    const isDashboardRoute = new RegExp(dashboardRoute).test(router.pathname);

    const handleClose = useCallback(() => {
        setOpenState(false);
    }, []);

    const handleChooseSubscription = async () => {
        if (productFiltered) {
            if (!profile.stripeSubscriptionId || isTrial) {
                const response = await startCheckoutSessionForSubscriptionFx({
                    productId: productFiltered.product?.id || '',
                    baseUrl: dashboardRoute,
                    withTrial: isTrial,
                });

                if (response?.url) {
                    return router.push(response.url);
                }
            } else if (profile.stripeSubscriptionId) {
                const response = await getCustomerPortalSessionUrlFx({
                    subscriptionId: profile.stripeSubscriptionId,
                });

                if (response?.url) {
                    return router.push(response.url);
                }
            }
        }
    };

    useEffect(() => {
        if (isDashboardRoute && profile.shouldShowTrialExpiredNotification) {
            setOpenState(true);
        }
    }, [isDashboardRoute, profile.shouldShowTrialExpiredNotification]);

    useEffect(() => {
        if (open) {
            updateProfileFx({ shouldShowTrialExpiredNotification: false });
        }

        const el = document.getElementById('upgrade');
        if (el) {
            el.onclick = () => handleChooseSubscription();
        }
    }, [open]);

    return (
        <Snackbar
            classes={{
                root: styles.snackBarRoot,
            }}
            ContentProps={{
                classes: {
                    root: styles.snackBarContent,
                    action: styles.snackBarAction,
                },
            }}
            message={
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="center"
                    wrap="nowrap"
                    className={styles.wrapper}
                >
                    <CustomTypography
                        variant="body2"
                        className={styles.text}
                        dangerouslySetInnerHTML={{
                            __html: `${translation(
                                'trialExpired.text',
                            )} <a style="color: blue;cursor: pointer;" id="upgrade">Upgrade to Pro</a>`,
                        }}
                    />
                </CustomGrid>
            }
            open={open}
            action={
                <CustomIconButton disableRipple onClick={handleClose}>
                    <CloseIcon width="24px" height="24px" />
                </CustomIconButton>
            }
        />
    );
};

const SubscriptionExpiredNotification = memo(Component);

export default SubscriptionExpiredNotification;
