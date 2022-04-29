import React, { memo, useCallback } from 'react';
import { useStore } from 'effector-react';
import Image from 'next/image';
import clsx from 'clsx';

import { Fade } from '@mui/material';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// components
import { DownloadIcon } from '@library/icons/DownloadIcon';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { CloseIcon } from '@library/icons/CloseIcon';

// stores
import {
    $isIcsEventLinkAvailableStore,
    $scheduleEventLinkStore,
    setScheduleEventLinkEvent,
} from '../../store/templates';

// styles
import styles from './DownloadIcsEvent.module.scss';

const Component = () => {
    const scheduleEventLink = useStore($scheduleEventLinkStore);
    const isIcsEventLinkAvailable = useStore($isIcsEventLinkAvailableStore);

    const handleClose = useCallback(() => {
        setScheduleEventLinkEvent('');
    }, []);

    const handleDownloadIcsLink = useCallback(async () => {
        window.open(scheduleEventLink);

        setScheduleEventLinkEvent('');
    }, [scheduleEventLink]);

    return (
        <Fade in={isIcsEventLinkAvailable}>
            <CustomPaper className={clsx(styles.downloadIcsEvent)}>
                <CustomGrid container alignItems="center" wrap="nowrap" gap={1}>
                    <CustomBox className={styles.image}>
                        <Image src="/images/thumb-up.png" width="24px" height="24px" />
                    </CustomBox>
                    <CustomTypography
                        nameSpace="dashboard"
                        translation="meetingScheduled"
                        className={styles.text}
                    />
                    <CustomButton
                        className={styles.downloadButton}
                        onClick={handleDownloadIcsLink}
                        Icon={<DownloadIcon width="22px" height="22px" />}
                        nameSpace="dashboard"
                        translation="ics"
                    />
                    <ActionButton
                        className={styles.cancelButton}
                        variant="cancel"
                        onAction={handleClose}
                        Icon={<CloseIcon width="22px" height="22px" />}
                    />
                </CustomGrid>
            </CustomPaper>
        </Fade>
    );
}

export const DownloadIcsEvent = memo(Component);
