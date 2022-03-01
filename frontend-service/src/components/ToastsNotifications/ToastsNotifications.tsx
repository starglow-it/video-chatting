import React, { memo, useCallback, useEffect, useState } from 'react';
import { Snackbar } from '@mui/material';
import { useStore } from 'effector-react';

// hooks
import { useLocalization } from '../../hooks/useTranslation';

// store
import { $notificationsStore, removeNotification } from '../../store/notifications';

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
            message={translation(messageInfo?.message || '')}
        />
    );
});

export { ToastsNotifications };
