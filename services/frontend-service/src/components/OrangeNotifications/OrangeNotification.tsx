import { memo, useCallback, useEffect, useState } from 'react';
import { Snackbar, SnackbarContent } from '@mui/material';
import { useStore } from 'effector-react';

// hooks
import { useLocalization } from '@hooks/useTranslation';
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

//@Mui
import IconButton from '@mui/material/IconButton';

// icons
import CloseIcon from '@mui/icons-material/Close';

// const
import { ONE_SECOND } from '../../const/time/common';

// store
import { $orangeNotificationsStore, removeOrangeNotification } from '../../store';

// types
import { orangeNotification } from '../../store/types';

// styles
import styles from './OrangeNotification.module.scss';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

const AUTO_HIDE_DURATION = 7 * ONE_SECOND;

const Component = () => {
    const notifications = useStore($orangeNotificationsStore);

    const { translation } = useLocalization('notifications');

    const [open, setOpen] = useState(false);
    const [messageInfo, setMessageInfo] = useState<orangeNotification>();

    const { isMobile } = useBrowserDetect();

    useEffect(() => {
        if (notifications.length && !messageInfo) {
            setMessageInfo({ ...notifications[0] });
            removeOrangeNotification();
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
            {...(messageInfo?.withManualClose
                ? {}
                : { autoHideDuration: AUTO_HIDE_DURATION })}

            className={styles.snackBar}
        >
            <SnackbarContent
                className={styles.content}
                message={
                    <CustomGrid container alignItems="center" gap={1}>
                        <CustomImage
                            src={ messageInfo?.isIconHand ? "/images/handForNotificatioin.png" : "/images/star.png" }
                            width="35px"
                            height="35px"
                            alt="star"
                        />
                        <CustomTypography className={styles.notificationText}>
                            {translation(
                                messageInfo?.message || '',
                                messageInfo?.messageOptions ?? {},
                            )}
                        </CustomTypography>
                    </CustomGrid>
                }
                action={
                    <IconButton className={styles.closeBtn} onClick={() => setOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                }
            />


        </Snackbar>
    );
};

export const OrangeNotification = memo(Component);
