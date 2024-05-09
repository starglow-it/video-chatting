import { memo, useCallback } from 'react';
import { useStore } from 'effector-react';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';

// components
import { DownloadIcon } from 'shared-frontend/icons/OtherIcons/DownloadIcon';

// stores
import { Translation } from '@library/common/Translation/Translation';
import {
    $appDialogsStore,
    appDialogsApi,
    $scheduleEventLinkStore,
    setScheduleEventLinkEvent,
} from '../../../store';

// styles
import styles from './DownloadIcsEventDialog.module.scss';

// types
import { AppDialogsEnum } from '../../../store/types';

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
        try {
            window.open(scheduleEventLink);

            setScheduleEventLinkEvent('');

            appDialogsApi.closeDialog({
                dialogKey: AppDialogsEnum.downloadIcsEventDialog,
            });
        } catch (error) {

        }
    }, [scheduleEventLink]);

    return (
        <CustomDialog
            contentClassName={styles.wrapper}
            open={downloadIcsEventDialog}
        >
            <CustomGrid
                container
                direction="column"
                alignItems="center"
                wrap="nowrap"
                gap={5}
            >
                <CustomTypography
                    variant="h4"
                    textAlign="center"
                    nameSpace="templates"
                    translation="scheduleMeeting.downloadIcsTitle"
                />
                <CustomGrid container gap={2} wrap="nowrap">
                    <CustomButton
                        label={
                            <Translation
                                nameSpace="common"
                                translation="buttons.done"
                            />
                        }
                        variant="custom-cancel"
                        onClick={handleClose}
                    />
                    <CustomButton
                        onClick={handleDownloadIcsLink}
                        Icon={<DownloadIcon width="22px" height="22px" />}
                        label={
                            <Translation
                                nameSpace="templates"
                                translation="scheduleMeeting.downloadIcs"
                            />
                        }
                    />
                </CustomGrid>
            </CustomGrid>
        </CustomDialog>
    );
};

export const DownloadIcsEventDialog = memo(Component);
