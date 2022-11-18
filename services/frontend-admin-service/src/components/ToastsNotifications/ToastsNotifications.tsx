import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import { Snackbar, SnackbarContent } from '@mui/material';
import { useStore } from 'effector-react';
import {Trans} from "react-i18next";

// hooks
import { useLocalization } from '@hooks/useTranslation';
import { useBrowserDetect } from 'shared-frontend/hooks';

// custom
import { CustomGrid, ConditionalRender } from 'shared-frontend/library';

// icons
import {LockIcon, RoundSuccessIcon, TrashIcon} from 'shared-frontend/icons';
import { RoundErrorIcon } from 'shared-frontend/icons';

// const
import { ONE_SECOND } from 'shared-const';

// store
import { $notificationsStore, removeNotification } from '../../store';

// types
import { Notification } from '../../store/types';

// styles
import styles from './ToastsNotifications.module.scss';

const AUTO_HIDE_DURATION = 7 * ONE_SECOND;

const icons = {
    "LockIcon": LockIcon,
    "DeleteIcon": TrashIcon,
}

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

    const Icon = useMemo(() => {
        return icons[messageInfo?.iconType];
    }, [messageInfo?.iconType])

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
                        <ConditionalRender condition={Boolean(messageInfo?.withSuccessIcon)}>
                            <RoundSuccessIcon width="16px" height="16px" />
                        </ConditionalRender>
                        <ConditionalRender condition={Boolean(messageInfo?.withErrorIcon)}>
                            <RoundErrorIcon width="16px" height="16px" />
                        </ConditionalRender>
                        <ConditionalRender condition={Boolean(Icon)}>
                            <Icon width="16px" height="16px" />
                        </ConditionalRender>
                        <Trans>
                            {translation(messageInfo?.message || '', messageInfo?.messageOptions ?? {})}
                        </Trans>
                    </CustomGrid>
                }
            />
        </Snackbar>
    );
};

export const ToastsNotifications = memo(Component);
