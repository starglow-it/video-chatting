import { useStore } from 'effector-react';
import { memo, useEffect, useRef } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import {
    ACCEPT_MIMES,
    ACCEPT_MIMES_IMAGE,
    ACCEPT_MIMES_VIDEO,
    MAX_SIZE_IMAGE_MB,
    MAX_SIZE_VIDEO_MB,
} from 'shared-const';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import {
    $backgroundsManageStore,
    addMediaFx,
    addNotificationEvent,
    getMediasFx,
    openAdminDialogEvent,
    setMediaIdDeleteEvent,
    setQueryMediasEvent,
} from 'src/store';
import {
    AdminDialogsEnum,
    Notification,
    NotificationType,
} from 'src/store/types';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { Translation } from '@components/Translation/Translation';
import { UploadFolderIcon } from 'shared-frontend/icons/OtherIcons/UploadFolderIcon';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { MediaItem } from '../MediaItem/MediaItem';
import styles from './Medias.module.scss';
import {
    MAX_SIZE_IMAGE,
    MAX_SIZE_VIDEO,
} from '@components/CreateRoom/UploadBackground/UploadBackground';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

const Component = () => {
    const { medias, categorySelected, count } = useStore(
        $backgroundsManageStore,
    );
    const isLoadMore = useStore(getMediasFx.pending);
    const isLoading = useStore(addMediaFx.pending);
    const refScroll = useRef<HTMLElement>();

    useEffect(() => {
        if (refScroll.current) refScroll.current.scrollTop = 0;
    }, [categorySelected, isLoading]);

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

        addMediaFx({ categoryId: categorySelected || '', file });
    };

    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        maxSize: Math.max(MAX_SIZE_IMAGE, MAX_SIZE_VIDEO),
        accept: ACCEPT_MIMES,
        onDrop: handleSetFileData,
        noDrag: false,
    });

    const { onClick, ...rootProps } = getRootProps();

    const handleScrollEnd = () => {
        if (!isLoadMore && medias.length < count) {
            setQueryMediasEvent();
        }
    };

    const handleDeleteMedia = (mediaId: string) => {
        setMediaIdDeleteEvent(mediaId);
        openAdminDialogEvent(AdminDialogsEnum.confirmDeleteMediaDialog);
    };

    return (
        <CustomGrid sm={8} {...rootProps}>
            <CustomPaper className={styles.paper}>
                <CustomGrid
                    className={styles.actions}
                    display="flex"
                    justifyContent="flex-end"
                >
                    <CustomGrid container>
                        <CustomTypography variant="h4bold" fontSize={16}>
                            <Translation
                                nameSpace="rooms"
                                translation="backgrounds.medias"
                            />
                        </CustomTypography>
                    </CustomGrid>
                    <ActionButton
                        className={styles.button}
                        variant="decline"
                        onAction={onClick}
                        Icon={<UploadFolderIcon width="18px" height="18px" />}
                    />
                </CustomGrid>
                <input {...getInputProps()} />
                <ConditionalRender condition={medias.length}>
                    <PerfectScrollbar
                        className={styles.scroll}
                        onYReachEnd={handleScrollEnd}
                        containerRef={el => (refScroll.current = el)}
                    >
                        {medias.map(item => (
                            <MediaItem
                                key={item.id}
                                media={item}
                                onDelete={handleDeleteMedia}
                            />
                        ))}
                    </PerfectScrollbar>
                </ConditionalRender>
            </CustomPaper>
        </CustomGrid>
    );
};
export const Medias = memo(Component);
