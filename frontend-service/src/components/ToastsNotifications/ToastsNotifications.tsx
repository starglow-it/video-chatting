import React, { memo, useCallback, useEffect, useState } from 'react';
import { Snackbar } from '@mui/material';
import { useStore } from 'effector-react';

// hooks

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// icons
import {RoundSuccessIcon} from "@library/icons/RoundIcons/RoundSuccessIcon";
import {RoundErrorIcon} from "@library/icons/RoundIcons/RoundErrorIcon";
import { useLocalization } from '../../hooks/useTranslation';

// store
import { $notificationsStore, removeNotification } from '../../store';

// types
import { Notification } from '../../store/types';

// styles
import styles from './ToastsNotifications.module.scss';


const ToastsNotifications = memo(() => {
    const notifications = useStore($notificationsStore);

    const { translation } = useLocalization('notifications');

    const [open, setOpen] = useState(false);
    const [messageInfo, setMessageInfo] = useState<Notification>();

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
            className={styles.snackbar}
            onClose={handleClose}
            key={messageInfo ? messageInfo.type : undefined}
            TransitionProps={{ onExited: handleExited }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            open={open}
            autoHideDuration={3000}
            message={(
                <CustomGrid container alignItems="center" gap={1}>
                    {messageInfo?.withSuccessIcon
                        ? (
                            <RoundSuccessIcon width="16px" height="16px" />
                        )
                        : null
                    }
                    {messageInfo?.withErrorIcon
                        ? (
                            <RoundErrorIcon width="16px" height="16px" />
                        )
                        : null
                    }
                    {translation(messageInfo?.message || '')}
                </CustomGrid>
            )}
        />
    );
});

export { ToastsNotifications };
