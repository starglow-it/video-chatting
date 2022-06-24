import React, { memo, useCallback } from 'react';
import { useStore } from 'effector-react';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import {CustomDialog} from "@library/custom/CustomDialog/CustomDialog";

// components
import { DownloadIcon } from '@library/icons/DownloadIcon';

// stores
import {
    $scheduleEventLinkStore,
    setScheduleEventLinkEvent,
} from '../../../store';
import {$appDialogsStore, appDialogsApi} from "../../../store";

// styles
import styles from './DownloadIcsEventDialog.module.scss';

// types
import {AppDialogsEnum} from "../../../store/types";

const Component = () => {
    const { downloadIcsEventDialog } = useStore($appDialogsStore);
    const scheduleEventLink = useStore($scheduleEventLinkStore);

    const handleClose = useCallback(() => {
        setScheduleEventLinkEvent('');

        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.downloadIcsEventDialog,
        });
    }, []);

    const handleDownloadIcsLink = useCallback(async () => {
        window.open(scheduleEventLink);

        setScheduleEventLinkEvent('');

        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.downloadIcsEventDialog,
        });
    }, [scheduleEventLink]);

    return (
        <CustomDialog contentClassName={styles.wrapper} open={downloadIcsEventDialog}>
            <CustomGrid container direction="column" alignItems="center" wrap="nowrap" gap={5}>
                <CustomTypography variant="h4" textAlign="center" nameSpace="templates" translation="scheduleMeeting.downloadIcsTitle" />
                <CustomGrid container gap={2} wrap="nowrap">
                    <CustomButton
                        nameSpace="common"
                        translation="buttons.cancel"
                        variant="custom-cancel"
                        onClick={handleClose}
                    />
                    <CustomButton
                        onClick={handleDownloadIcsLink}
                        Icon={<DownloadIcon width="22px" height="22px" />}
                        nameSpace="templates"
                        translation="scheduleMeeting.downloadIcs"
                    />
                </CustomGrid>
            </CustomGrid>
        </CustomDialog>
    );
}

export const DownloadIcsEventDialog = memo(Component);
