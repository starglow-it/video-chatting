import React, { memo, useCallback, useEffect, useState } from 'react';
import { Snackbar, SnackbarContent } from '@mui/material';
import { useStore } from 'effector-react';

// hooks
import { useLocalization } from '@hooks/useTranslation';
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// icons
import { RoundSuccessIcon } from 'shared-frontend/icons/RoundIcons/RoundSuccessIcon';
import { RoundErrorIcon } from 'shared-frontend/icons/RoundIcons/RoundErrorIcon';

// const
import { ONE_SECOND } from '../../const/time/common';

// store
import { $notificationsStore, removeNotification } from '../../store';

// types
import { Notification } from '../../store/types';

// styles
import styles from './ToastsNotifications.module.scss';

const AUTO_HIDE_DURATION = 7 * ONE_SECOND;

const Component = () => {
    const notifications = useStore($notificationsStore);

    const { translation } = useLocalization('notifications');

    const [open, setOpen] = useState(false);
    const [messageInfo, setMessageInfo] = useState<Notification>();

    const { isMobile } = useBrowserDetect();

    useEffect(() => {
        if (notifications.length && !messageInfo) {
            setMessageInfo({ ...notifications[0] });
            removeNotification();
            setOpen(true);
        } else if (notifications.length && messageInfo && open) {
            setOpen(false);
        }
    }, [notifications, messageInfo, open]);

    const handleExited = useCallback(() => {
        setMessageInfo(undefined);
    }, []);

    const handleClose = useCallback(() => {
        setMessageInfo(undefined);
        setOpen(false);
    }, []);

    return (
        <Snackbar
            onClose={handleClose}
            key={messageInfo ? messageInfo.type : undefined}
            TransitionProps={{ onExited: handleExited }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: isMobile ? 'left' : 'center',
            }}
            open={open}
            {...(messageInfo?.withManualClose ? {} : { autoHideDuration: AUTO_HIDE_DURATION })}
        >
            <SnackbarContent
                className={styles.content}
                message={
                    <CustomGrid container alignItems="center" gap={1}>
                        <ConditionalRender condition={messageInfo?.withSuccessIcon || false}>
                            <RoundSuccessIcon width="16px" height="16px" />
                        </ConditionalRender>
                        <ConditionalRender condition={messageInfo?.withErrorIcon || false}>
                            <RoundErrorIcon width="16px" height="16px" />
                        </ConditionalRender>
                        {translation(messageInfo?.message || '', messageInfo?.messageOptions ?? {})}
                    </CustomGrid>
                }
            />
        </Snackbar>
    );
};

export const ToastsNotifications = memo(Component);
