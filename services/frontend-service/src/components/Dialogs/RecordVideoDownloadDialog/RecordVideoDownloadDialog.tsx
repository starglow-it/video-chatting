import { memo, useEffect, useRef, useState } from 'react';
import { useStore } from 'effector-react';

// custom
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// stores
import { Translation } from '@library/common/Translation/Translation';
import { $appDialogsStore, appDialogsApi } from '../../../store';

// types
import { AppDialogsEnum } from '../../../store/types';

// styles
import styles from './RecordVideoDownloadDialog.module.scss';
import { $recordedVideoBlobStore, resetRecordedVideoBlobStore, uploadToS3Event } from 'src/store/roomStores';
import { UploadArrowIcon } from 'shared-frontend/icons/OtherIcons/UploadArrow';


const RecordVideoDownloadDialog = memo(() => {
    const recordVideoDownloadDialog = useStore($appDialogsStore).recordVideoDownloadDialog;
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [videoUrl, setVideoUrl] = useState('');

    const videoBlob = useStore($recordedVideoBlobStore);

    useEffect(() => {
        if (videoBlob) {
            const url = URL.createObjectURL(videoBlob);
            setVideoUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [videoBlob]);

    const handleClose = () => {
        if (videoUrl) {
            URL.revokeObjectURL(videoUrl);
            setVideoUrl('');
        }
        resetRecordedVideoBlobStore();
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

    const handleUploadS3 = () => {
        if (!videoBlob) {
            console.error('Video URL is empty');
            return;
        }
        uploadToS3Event(videoBlob);
    };

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
                {/* <CustomTypography textAlign="left" fontSize={14} className={styles.description}>
                    <Translation nameSpace="meeting" translation="recordVideoDownloadDescription" />
                    <UploadArrowIcon width="40px" height="40px" onClick={handleUploadS3} />
                </CustomTypography> */}
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
                <CustomGrid container alignItems="center" justifyContent="space-between" className={styles.buttonsWrapper} wrap="nowrap">
                    <CustomButton variant={"custom-cancel" as any} className={styles.button} onClick={handleDownload}>
                        <Translation nameSpace="meeting" translation="buttons.download" />
                    </CustomButton>
                    <CustomButton className={styles.button} onClick={handleUploadS3}>
                        <Translation nameSpace="meeting" translation="buttons.upload" />
                    </CustomButton>
                </CustomGrid>
            </CustomGrid>
        </CustomDialog>
    );
});

export { RecordVideoDownloadDialog };
