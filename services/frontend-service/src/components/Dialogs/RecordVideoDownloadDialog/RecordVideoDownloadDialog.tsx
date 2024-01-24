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
import { $recordedVideoBlobStore, $uploadVideoToS3Store, resetRecordedVideoBlobStore, resetUploadVideoToS3Store, uploadToS3Event } from 'src/store/roomStores';
import { UploadArrowIcon } from 'shared-frontend/icons/OtherIcons/UploadArrow';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { LinearProgress } from '@mui/material';
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';
import { CustomLinkIcon } from 'shared-frontend/icons/OtherIcons/CustomLinkIcon';


const RecordVideoDownloadDialog = memo(() => {
    const recordVideoDownloadDialog = useStore($appDialogsStore).recordVideoDownloadDialog;
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [statusUploadingToS3, setStatusUploadingToS3] = useState<string>('');

    const videoBlob = useStore($recordedVideoBlobStore);

    const uploadVideoToS3Store = useStore($uploadVideoToS3Store);

    useEffect(() => {
        if (videoBlob) {
            const url = URL.createObjectURL(videoBlob);
            setVideoUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [videoBlob]);

    useEffect(() => {
        console.log(uploadVideoToS3Store)
        if (uploadVideoToS3Store) {
            setStatusUploadingToS3('done');
        }
    }, [uploadVideoToS3Store]);

    const handleClose = () => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.recordVideoDownloadDialog,
        });
        if (videoUrl) {
            URL.revokeObjectURL(videoUrl);
            setVideoUrl('');
        }
        setStatusUploadingToS3('')
        resetUploadVideoToS3Store();
        resetRecordedVideoBlobStore();
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

    const handleUploadS3 = () => {
        if (!videoBlob) {
            console.error('Video URL is empty');
            return;
        }
        setStatusUploadingToS3('pending');
        uploadToS3Event(videoBlob);
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
                alignItems="center"
                justifyContent="center"
            >
                <CustomTypography variant="h3bold" textAlign="center" className={styles.title}>
                    <Translation nameSpace="meeting" translation="recordVideoDownloadTitle" />
                </CustomTypography>
                <ConditionalRender condition={statusUploadingToS3 == ""}>
                    <CustomGrid
                        container
                        className={styles.wrapper}
                        wrap="nowrap"
                    >
                        {videoBlob && (
                            <video
                                src={videoUrl}
                                ref={videoRef}
                                width={450}
                                height={250}
                                autoPlay
                                controls
                            />
                        )}
                    </CustomGrid>
                    <CustomGrid container alignItems="center" justifyContent="space-between" className={styles.buttonsWrapper} wrap="nowrap">
                        <CustomButton variant={"custom-cancel" as any} className={styles.button} onClick={handleDownload}>
                            <Translation nameSpace="meeting" translation="buttons.download" />
                        </CustomButton>
                        <CustomButton className={styles.button} onClick={handleUploadS3}>
                            <Translation nameSpace="meeting" translation="buttons.upload" />
                        </CustomButton>
                    </CustomGrid>
                </ConditionalRender>
                <ConditionalRender condition={statusUploadingToS3 == "pending"}>
                    <CustomGrid
                        container
                        className={styles.wrapper}
                        wrap="nowrap"
                    >
                        <CustomLoader className={styles.loader} />
                    </CustomGrid>

                    <CustomGrid container alignItems="center" justifyContent="space-between" className={styles.buttonsWrapper} wrap="nowrap">
                        <CustomButton variant={"custom-cancel" as any} className={styles.button} onClick={handleClose}>
                            <Translation nameSpace="meeting" translation="buttons.close" />
                        </CustomButton>
                    </CustomGrid>
                </ConditionalRender>
                <ConditionalRender condition={statusUploadingToS3 == "done"}>
                    <CustomGrid
                        container
                        className={styles.wrapper}
                    >
                        <CustomGrid
                            container
                            className={styles.linkWrapper}
                            wrap="nowrap"
                        >
                            <CustomLinkIcon width="24px" height="24px" />
                            <CustomTypography className={styles.linkText}>
                                <a href={uploadVideoToS3Store} target='_blank' >{uploadVideoToS3Store}</a>
                            </CustomTypography>
                        </CustomGrid>
                    </CustomGrid>
                    <CustomGrid container alignItems="center" justifyContent="space-between" className={styles.buttonsWrapper} wrap="nowrap">
                        <CustomButton variant={"custom-cancel" as any} className={styles.button} onClick={handleClose}>
                            <Translation nameSpace="meeting" translation="buttons.close" />
                        </CustomButton>

                        <CopyToClipboard
                            text={uploadVideoToS3Store}
                            onCopy={handleLinkCopied}
                        >
                            <CustomButton
                                className={styles.button}
                                label={
                                    <Translation
                                        nameSpace="common"
                                        translation="buttons.copy"
                                    />
                                }
                            />
                        </CopyToClipboard>
                    </CustomGrid>
                </ConditionalRender>
            </CustomGrid>
        </CustomDialog>
    );
});

export { RecordVideoDownloadDialog };
