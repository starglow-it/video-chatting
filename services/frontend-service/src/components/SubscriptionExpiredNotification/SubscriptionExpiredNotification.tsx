import React, { memo, useCallback, useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { useRouter } from 'next/router';
import { useStore } from 'effector-react';

// custom
import { CustomGrid } from 'shared-frontend/library';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from 'shared-frontend/library';
import { CustomIconButton } from '@library/custom/CustomIconButton/CustomIconButton';

// icons
import { WarningIcon } from 'shared-frontend/icons';
import { CloseIcon } from 'shared-frontend/icons';

// styles
import { useLocalization } from '@hooks/useTranslation';
import { Translation } from '@library/common/Translation/Translation';
import styles from './SubscriptionExpiredNotification.module.scss';

// stores
import { $profileStore, resetTrialExpiredNotificationFx } from '../../store';

// const
import { dashboardRoute, profileRoute } from '../../const/client-routes';

type ComponentProps = unknown;

const Component: React.FunctionComponent<ComponentProps> = () => {
    const router = useRouter();

    const [open, setOpenState] = useState(false);

    const profile = useStore($profileStore);

    const { translation } = useLocalization('subscriptions');

    const handleOpenProfile = useCallback(() => {
        window.open(profileRoute, '_blank');
    }, []);

    const isDashboardRoute = new RegExp(dashboardRoute).test(router.pathname);

    const handleClose = useCallback(() => {
        setOpenState(false);
    }, []);

    useEffect(() => {
        if (isDashboardRoute && profile.shouldShowTrialExpiredNotification) {
            setOpenState(true);
        }
    }, [isDashboardRoute, profile.shouldShowTrialExpiredNotification]);

    useEffect(() => {
        if (open) {
            resetTrialExpiredNotificationFx();
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
                    <WarningIcon width="22px" height="22px" />
                    <CustomTypography
                        variant="body2"
                        className={styles.text}
                        dangerouslySetInnerHTML={{
                            __html: translation('trialExpired.text'),
                        }}
                    />
                    <CustomButton
                        variant="custom-common"
                        onClick={handleOpenProfile}
                        label={
                            <Translation nameSpace="subscriptions" translation="buttons.manage" />
                        }
                        className={styles.button}
                        typographyProps={{
                            variant: 'body2',
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
