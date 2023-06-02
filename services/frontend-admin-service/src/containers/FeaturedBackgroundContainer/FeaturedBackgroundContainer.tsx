import { Translation } from '@components/Translation/Translation';
import { memo, useEffect } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import styles from './FeaturedBackgroundContainer.module.scss';
import {
    $backgroundsManageStore,
    $featuredBackgroundStore,
    addNotificationEvent,
    createFeaturedBackgroundFx,
    deleteFeaturedBackground,
    getCategoriesFx,
    getFeaturedBackgroundFx,
    selectCategoryEvent,
} from 'src/store';
import { useStore } from 'effector-react';
import { Medias } from '@components/Backgrounds/Medias/Medias';
import { ConfirmDeleteMediaDialog } from '@components/Dialogs/ConfirmDeleteMediaDialog/ConfirmDeleteMediaDialog';
import { ConfirmDeleteCategoryDialog } from '@components/Dialogs/ConfirmDeleteCategoryDialog/ConfirmDeleteCategoryDialog';
import { Categories } from '@components/Backgrounds/Categories/Categories';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { UploadFolderIcon } from 'shared-frontend/icons/OtherIcons/UploadFolderIcon';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { LinearProgress } from '@mui/material';
import { mapEmoji, parseEmoji } from 'shared-utils';
import { FeaturedItem } from '@components/FeaturedBackground/FeaturedItem/FeaturedItem';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Notification, NotificationType } from 'src/store/types';
import { FileRejection, useDropzone } from 'react-dropzone';
import {
    MAX_SIZE_IMAGE,
    MAX_SIZE_VIDEO,
} from '@components/CreateRoom/UploadBackground/UploadBackground';
import {
    ACCEPT_MIMES,
    ACCEPT_MIMES_IMAGE,
    ACCEPT_MIMES_VIDEO,
    MAX_SIZE_IMAGE_MB,
    MAX_SIZE_VIDEO_MB,
} from 'shared-const';

const Component = () => {
    const { list } = useStore($featuredBackgroundStore);
    const isLoading = useStore(createFeaturedBackgroundFx.pending);

    useEffect(() => {
        (async () => getFeaturedBackgroundFx({ skip: 0, limit: 6 }))();
    }, []);

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

        createFeaturedBackgroundFx(file);
    };

    const handleDeleteMedia = (id: string) => {
        deleteFeaturedBackground(id);
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
            container
            direction="column"
            alignItems="center"
            className={styles.wrapper}
            {...rootProps}
        >
            <CustomGrid
                container
                justifyContent="center"
                alignItems="center"
                gap={1.5}
            >
                <CustomTypography variant="h1">
                    <Translation
                        nameSpace="common"
                        translation="featuredBackground.title"
                    />
                </CustomTypography>
                <CustomGrid
                    container
                    justifyContent="center"
                    alignItems="flex-start"
                >
                    <CustomPaper className={styles.paper}>
                        <CustomGrid
                            className={styles.actions}
                            display="flex"
                            justifyContent="flex-end"
                        >
                            <CustomGrid>
                                <ActionButton
                                    className={styles.button}
                                    variant="decline"
                                    onAction={onClick}
                                    Icon={
                                        <CustomGrid>
                                            <UploadFolderIcon
                                                width="18px"
                                                height="18px"
                                            />
                                            <ConditionalRender
                                                condition={isLoading}
                                            >
                                                <LinearProgress
                                                    classes={{
                                                        root: styles.progressBar,
                                                    }}
                                                />
                                            </ConditionalRender>
                                        </CustomGrid>
                                    }
                                />
                            </CustomGrid>
                        </CustomGrid>
                        <input {...getInputProps()} />
                        <ConditionalRender condition={Boolean(list.length)}>
                            <PerfectScrollbar
                                className={styles.scroll}
                                // onYReachEnd={handleScrollEnd}
                            >
                                {list.map(item => (
                                    <FeaturedItem
                                        key={item.id}
                                        media={item}
                                        onDelete={handleDeleteMedia}
                                    />
                                ))}
                            </PerfectScrollbar>
                        </ConditionalRender>
                        <ConditionalRender condition={!list.length}>
                            <CustomGrid
                                container
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                height="200px"
                                bgcolor="#f4f6f9"
                                flexDirection="column"
                            >
                                <CustomGrid fontSize={30}>
                                    {parseEmoji(mapEmoji('1f3a5'))}
                                </CustomGrid>
                                <CustomTypography variant="h4" fontSize={16}>
                                    <Translation
                                        nameSpace="rooms"
                                        translation="backgrounds.emptyMedias"
                                    />
                                </CustomTypography>
                            </CustomGrid>
                        </ConditionalRender>
                    </CustomPaper>
                </CustomGrid>
            </CustomGrid>
            <ConfirmDeleteMediaDialog />
            <ConfirmDeleteCategoryDialog />
        </CustomGrid>
    );
};

export const FeaturedBackgroundContainer = memo(Component);
