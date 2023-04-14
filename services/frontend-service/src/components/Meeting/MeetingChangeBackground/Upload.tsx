import { useStore } from 'effector-react';
import { memo } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import {
    ACCEPT_MIMES,
    ACCEPT_MIMES_IMAGE,
    ACCEPT_MIMES_VIDEO,
    MAX_SIZE_IMAGE_MB,
    MAX_SIZE_VIDEO_MB,
} from 'shared-const';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { MAX_SIZE_IMAGE, MAX_SIZE_VIDEO } from 'src/const/templates/file';
import { addNotificationEvent } from 'src/store';
import {
    $backgroundMeetingStore,
    $meetingTemplateStore,
    addBackgroundToCategoryEvent,
    reloadMediasEvent,
    uploadNewBackgroundFx,
} from 'src/store/roomStores';
import { Notification, NotificationType } from 'src/store/types';
import { UploadImageIcon } from 'shared-frontend/icons/OtherIcons/UploadImageIcon';
import clsx from 'clsx';
import styles from './MeetingChangeBackground.module.scss';

const Component = () => {
    const meetingTemplate = useStore($meetingTemplateStore);
    const backgroundStore = useStore($backgroundMeetingStore);

    const generateFileUploadError = (
        rejectedFiles: FileRejection[],
        total: number,
    ) => {
        if (!rejectedFiles.length) {
            return;
        }

        if (total > 1) {
            addNotificationEvent({
                type: NotificationType.UploadFileFail,
                message: 'createRoom.uploadBackground.manyFiles',
                withErrorIcon: true,
            });
            return;
        }

        const rejectedFile = rejectedFiles[0]?.file;
        if (!rejectedFile) return;

        const fileType = rejectedFile.type.split('/')[0];

        if (fileType !== 'image' && fileType !== 'video') return;

        const maxSize = fileType === 'image' ? MAX_SIZE_IMAGE : MAX_SIZE_VIDEO;
        const maxSizeMB =
            fileType === 'image' ? MAX_SIZE_IMAGE_MB : MAX_SIZE_VIDEO_MB;
        const isSizeExceeded = rejectedFile.size > maxSize;
        const isAcceptedMIME =
            fileType === 'image'
                ? ACCEPT_MIMES_IMAGE[rejectedFile.type]
                : ACCEPT_MIMES_VIDEO[rejectedFile.type];

        const notification: Notification = {
            type: NotificationType.UploadFileFail,
            messageOptions: { max: maxSizeMB },
            withErrorIcon: true,
            message: '',
        };

        if (isAcceptedMIME) {
            notification.message = `createRoom.uploadBackground.${fileType}.maxSize`;
        } else if (!isAcceptedMIME && isSizeExceeded) {
            notification.message = `createRoom.uploadBackground.${fileType}.general`;
        } else {
            notification.message = `createRoom.uploadBackground.${fileType}.invalidFormat`;
        }

        addNotificationEvent(notification);
    };

    const handleSetFileData = async (
        acceptedFiles: File[],
        rejectedFiles: FileRejection[],
    ) => {
        const totalFiles = acceptedFiles.length + rejectedFiles.length;

        if (rejectedFiles.length || totalFiles > 1) {
            generateFileUploadError(
                rejectedFiles,
                acceptedFiles.length + rejectedFiles.length,
            );
            return;
        }

        const file = acceptedFiles[0];

        if (ACCEPT_MIMES_IMAGE[file.type] && file.size > MAX_SIZE_IMAGE) {
            generateFileUploadError(
                [{ file, errors: [] }],
                acceptedFiles.length + rejectedFiles.length,
            );
            return;
        }

        const media = await uploadNewBackgroundFx({
            file,
            userTemplateId: meetingTemplate.id,
            mediaCategoryId: backgroundStore.categorySelected,
        });

        if (media) {
            if (backgroundStore.count >= 12) {
                addBackgroundToCategoryEvent({ media });
            } else {
                reloadMediasEvent();
            }
            addNotificationEvent({
                type: NotificationType.UploadBackgroundSuccess,
                message: '',
            });
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        maxSize: Math.max(MAX_SIZE_IMAGE, MAX_SIZE_VIDEO),
        accept: ACCEPT_MIMES,
        onDrop: handleSetFileData,
        noDrag: false,
    });

    const { onClick, ...rootProps } = getRootProps();

    return (
        <CustomGrid
            {...rootProps}
            onClick={onClick}
            className={clsx(styles.container, styles.upload)}
        >
            <input {...getInputProps()} />
            <CustomBox
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
            >
                <UploadImageIcon width="38px" height="38px" />
            </CustomBox>
        </CustomGrid>
    );
};
export const UploadBackground = memo(Component);
