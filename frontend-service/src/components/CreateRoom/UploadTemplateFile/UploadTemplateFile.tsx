import React, { memo, useCallback } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useFormContext, useWatch } from 'react-hook-form';
import clsx from 'clsx';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';

// components
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// hooks
import { useFileReader } from '@hooks/useFileReader';

// icons
import { ArrowUp } from '@library/icons/ArrowUp';
import { ArrowLeftIcon } from '@library/icons/ArrowLeftIcon';

// types
import { IUploadTemplateFormData } from '@containers/CreateRoomContainer/types';
import { UploadTemplateFileProps } from '@components/CreateRoom/UploadTemplateFile/types';
import { Notification, NotificationType } from '../../../store/types';

// const
import {
    ACCEPT_MIMES,
    ACCEPT_MIMES_IMAGE,
    ACCEPT_MIMES_VIDEO,
    MAX_SIZE_IMAGE,
    MAX_SIZE_IMAGE_MB,
    MAX_SIZE_VIDEO,
    MAX_SIZE_VIDEO_MB,
} from '../../../const/templates/file';

// store
import { addNotificationEvent } from '../../../store';

// style
import styles from './UploadTemplateFile.module.scss';

const Component = ({ onNextStep }: UploadTemplateFileProps) => {
    const { onFileAvailable } = useFileReader();

    const { setValue, control } = useFormContext<IUploadTemplateFormData>();

    const background = useWatch<IUploadTemplateFormData>({ control, name: 'background' });

    const generateFileUploadError = useCallback((rejectedFiles: FileRejection[], total: number) => {
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

        if (!rejectedFile) {
            return;
        }

        const fileType = rejectedFile.type.split('/')[0];

        if (fileType !== 'image' && fileType !== 'video') {
            return;
        }

        const maxSize = fileType === 'image' ? MAX_SIZE_IMAGE : MAX_SIZE_VIDEO;
        const maxSizeMB = fileType === 'image' ? MAX_SIZE_IMAGE_MB : MAX_SIZE_VIDEO_MB;
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
    }, []);

    const handleSetFileData = useCallback(
        async (acceptedFiles: File[], rejectedFiles: File[]) => {
            const totalFiles = acceptedFiles.length + rejectedFiles.length;

            if (rejectedFiles.length || totalFiles > 1) {
                generateFileUploadError(rejectedFiles, acceptedFiles.length + rejectedFiles.length);
                return;
            }

            const file = acceptedFiles[0];

            if (ACCEPT_MIMES_IMAGE[file.type] && file.size > MAX_SIZE_IMAGE) {
                generateFileUploadError([{ file }], acceptedFiles.length + rejectedFiles.length);
                return;
            }

            const dataUrl = await onFileAvailable(file);

            setValue('background', { file, dataUrl });
        },
        [generateFileUploadError],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
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
            className={clsx(styles.container, { [styles.active]: isDragActive })}
            {...rootProps}
        >
            <input {...getInputProps()} />
            <ConditionalRender condition={isDragActive}>
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="center"
                    direction="column"
                    gap={1.5}
                    className={styles.content}
                >
                    <CustomGrid item container className={styles.iconWrapper}>
                        <ArrowUp width="20px" height="25px" className={styles.icon} />
                    </CustomGrid>
                    <CustomTypography
                        variant="h2bold"
                        nameSpace="createRoom"
                        color="colors.white.primary"
                        translation="uploadBackground.title"
                    />
                </CustomGrid>
            </ConditionalRender>

            <ConditionalRender condition={!isDragActive && !background}>
                <CustomGrid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    className={styles.uploadDescription}
                >
                    <CustomTypography
                        variant="h2bold"
                        nameSpace="createRoom"
                        translation="uploadBackground.title"
                        className={styles.title}
                    />
                    <CustomTypography
                        color="colors.grayscale.semidark"
                        nameSpace="createRoom"
                        translation="uploadBackground.description"
                        className={styles.description}
                    />
                    <CustomTooltip
                        arrow
                        open
                        placement="bottom"
                        title={
                            <CustomGrid container direction="column" alignItems="center" gap={1}>
                                <CustomTypography
                                    variant="body2bold"
                                    nameSpace="createRoom"
                                    translation="uploadBackground.tip.title"
                                />
                                <CustomGrid item container direction="column" alignItems="center">
                                    <CustomTypography
                                        variant="body2"
                                        nameSpace="createRoom"
                                        translation="uploadBackground.tip.imageRestricts"
                                        options={{ maxSize: MAX_SIZE_IMAGE_MB }}
                                    />
                                    <CustomTypography
                                        variant="body2"
                                        nameSpace="createRoom"
                                        translation="uploadBackground.tip.videoRestricts"
                                        options={{ maxSize: MAX_SIZE_VIDEO_MB }}
                                    />
                                </CustomGrid>
                            </CustomGrid>
                        }
                        classes={{
                            tooltip: styles.tooltip,
                        }}
                    >
                        <CustomButton
                            nameSpace="createRoom"
                            translation="uploadBackground.actions.upload"
                            className={styles.button}
                            onClick={onClick}
                        />
                    </CustomTooltip>
                </CustomGrid>
            </ConditionalRender>

            <ConditionalRender condition={Boolean(background)}>
                <CustomGrid
                    container
                    gap={1.5}
                    flexWrap="nowrap"
                    justifyContent="center"
                    className={styles.buttonsGroup}
                >
                    <CustomButton
                        variant="custom-gray"
                        nameSpace="createRoom"
                        translation="uploadBackground.actions.change"
                        className={styles.button}
                        onClick={onClick}
                    />
                    <ActionButton
                        variant="accept"
                        Icon={<ArrowLeftIcon width="24px" height="24px" className={styles.icon} />}
                        className={styles.actionButton}
                        onAction={onNextStep}
                    />
                </CustomGrid>
            </ConditionalRender>
        </CustomGrid>
    );
};

export const UploadTemplateFile = memo(Component);
