import React, { memo, useCallback } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useFormContext, useWatch } from 'react-hook-form';
import { useStore } from 'effector-react';
import clsx from 'clsx';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';

// components
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// icons
import { ArrowUp } from '@library/icons/ArrowUp';
import { ArrowRightIcon } from '@library/icons/ArrowRightIcon';

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
import {
    addNotificationEvent,
    uploadTemplateFileFx,
    uploadUserTemplateFileFx,
} from '../../../store';

// style
import styles from './UploadTemplateFile.module.scss';

const Component = ({ onNextStep }: UploadTemplateFileProps) => {
    const { setValue, control } = useFormContext<IUploadTemplateFormData>();

    const background = useWatch<IUploadTemplateFormData>({ control, name: 'background' });
    const url = useWatch<IUploadTemplateFormData>({ control, name: 'url' });

    const isUploadTemplateFilePending = useStore(uploadTemplateFileFx.pending);
    const isUpdateMeetingTemplateFilePending = useStore(uploadUserTemplateFileFx.pending);

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

            setValue('background', file);
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

            <ConditionalRender condition={!isDragActive && !url && !background}>
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
                        variant="black-glass"
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
                                        translation="uploadBackground.tip.resolution"
                                    />
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
                        popperClassName={styles.popper}
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

            <ConditionalRender condition={Boolean(background) || Boolean(url)}>
                <CustomGrid
                    container
                    gap={1.5}
                    flexWrap="nowrap"
                    justifyContent="center"
                    className={styles.buttonsGroup}
                >
                    <ConditionalRender
                        condition={
                            !isUploadTemplateFilePending && !isUpdateMeetingTemplateFilePending
                        }
                    >
                        <CustomButton
                            variant="custom-gray"
                            nameSpace="createRoom"
                            translation="uploadBackground.actions.change"
                            className={styles.button}
                            onClick={onClick}
                        />
                    </ConditionalRender>
                    <ActionButton
                        variant="accept"
                        Icon={<ArrowRightIcon width="32px" height="32px" />}
                        className={styles.actionButton}
                        onAction={onNextStep}
                    />
                </CustomGrid>
            </ConditionalRender>
        </CustomGrid>
    );
};

export const UploadTemplateFile = memo(Component);
