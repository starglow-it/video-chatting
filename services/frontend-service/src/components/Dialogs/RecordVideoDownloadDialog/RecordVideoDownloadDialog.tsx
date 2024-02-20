import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from 'effector-react';
import CopyToClipboard from 'react-copy-to-clipboard';

// custom
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// stores
import { Translation } from '@library/common/Translation/Translation';
import { $appDialogsStore, addNotificationEvent, appDialogsApi } from '../../../store';

// types
import { AppDialogsEnum, NotificationType } from '../../../store/types';

// styles
import styles from './RecordVideoDownloadDialog.module.scss';
import {
    $recordingStream,
} from 'src/store/roomStores';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';
import { CustomLinkIcon } from 'shared-frontend/icons/OtherIcons/CustomLinkIcon';
import clsx from 'clsx';

const RecordVideoDownloadDialog = memo(() => {
    const recordVideoDownloadDialog = useStore($appDialogsStore).recordVideoDownloadDialog;
    const [videoUrl, setVideoUrl] = useState<string>('');
    const recordStream = useStore($recordingStream);

    useEffect(() => {
        if (!!recordStream.url) {
            setVideoUrl(recordStream.url);
            return () => URL.revokeObjectURL(recordStream.url);
        }
    }, [recordStream]);

    const handleClose = () => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.recordVideoDownloadDialog,
        });
    };

    const handleDownload = () => {
        if (!videoUrl) {
            console.error('Video URL is empty');
            return;
        }
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = 'recorded-video.mp4';
        a.click();
    };

    const handleLinkCopied = useCallback(() => {
        addNotificationEvent({
            type: NotificationType.LinkInfoCopied,
            message: 'meeting.copy.link',
        });
    }, []);

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={recordVideoDownloadDialog}
            onClose={handleClose}
        >
            <CustomGrid
                container
                direction="column"
                alignItems="flex-start"
                justifyContent="center"
                className={styles.innerWrapper}
            >
                <CustomTypography variant="h3bold" textAlign="center" className={styles.title}>
                    <Translation nameSpace="meeting" translation="recordVideoDownloadTitle" />
                </CustomTypography>
                <ConditionalRender condition={!Boolean(videoUrl)}>
                    <CustomGrid
                        item
                        container
                        justifyContent="center"
                        alignItems="center"
                    >
                        <CustomLoader />
                    </CustomGrid>
                </ConditionalRender>
                <ConditionalRender condition={Boolean(videoUrl)}>
                    <CustomGrid
                        container
                        className={styles.wrapper}
                        justifyContent="space-between"
                    >
                        <CustomGrid
                            container
                            className={styles.linkWrapper}
                            wrap="nowrap"
                        >
                            <CustomLinkIcon width="24px" height="24px" />
                            <CustomTypography className={styles.linkText}>
                                <a href={videoUrl} target='_blank' >{videoUrl}</a>
                            </CustomTypography>
                        </CustomGrid>
                        <CopyToClipboard
                            text={videoUrl}
                            onCopy={handleLinkCopied}
                        >
                            <CustomButton
                                className={clsx(styles.button, styles.copyBtn)}
                                label={
                                    <Translation
                                        nameSpace="common"
                                        translation="buttons.copy"
                                    />
                                }
                            />
                        </CopyToClipboard>
                    </CustomGrid>
                    <CustomGrid container alignItems="center" justifyContent="space-between" className={styles.buttonsWrapper} wrap="nowrap">
                        <CustomButton variant={"custom-cancel" as any} className={styles.button} onClick={handleClose}>
                            <Translation nameSpace="meeting" translation="buttons.close" />
                        </CustomButton>
                        <CustomButton variant={"custom-cancel" as any} className={clsx(styles.button, styles.downloadBtn)} onClick={handleDownload}>
                            <Translation nameSpace="meeting" translation="buttons.download" />
                        </CustomButton>
                    </CustomGrid>
                </ConditionalRender>
            </CustomGrid>
        </CustomDialog>
    );
});

export { RecordVideoDownloadDialog };
