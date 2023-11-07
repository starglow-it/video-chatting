import { memo, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { FileRejection, useDropzone } from 'react-dropzone';

// shared
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { CustomTooltip } from 'shared-frontend/library/custom/CustomTooltip';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { ArrowRightIcon } from 'shared-frontend/icons/OtherIcons/ArrowRightIcon';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { CopyLinkIcon } from 'shared-frontend/icons/OtherIcons/CopyLinkIcon';
import { YoutubeIcon } from 'shared-frontend/icons/OtherIcons/YoutubeIcon';

// utils
import { getFileSizeValue } from 'shared-utils';

// const
import {
    ACCEPT_MIMES,
    ACCEPT_MIMES_IMAGE,
    ACCEPT_MIMES_VIDEO,
    MAX_SIZE_IMAGE_MB,
    MAX_SIZE_VIDEO_MB,
} from 'shared-const';

// types
import { FileSizeTypesEnum } from 'shared-types';

// components
import { Translation } from '@components/Translation/Translation';

import { UploadDragFileOverlay } from '@components/UploadDragFileOverlay/UploadDragFileOverlay';



import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { useFormContext, useWatch } from 'react-hook-form';
import { hasYoutubeUrlRegex } from 'shared-frontend/const/regexp';
import { useToggle } from 'shared-frontend/hooks/useToggle';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomInput } from 'shared-frontend/library/custom/CustomInput';
import { InputAdornment } from '@mui/material';
import styles from './UploadBackground.module.scss';
import { UploadBackgroundProps } from './UploadBackground.types';
import { Notification, NotificationType } from '../../../store/types';
import {
    addNotificationEvent,
    updateCommonTemplateDataEvent,
} from '../../../store';

export const MAX_SIZE_IMAGE = getFileSizeValue({
    sizeType: FileSizeTypesEnum.megabyte,
    amount: MAX_SIZE_IMAGE_MB,
});
export const MAX_SIZE_VIDEO = getFileSizeValue({
    sizeType: FileSizeTypesEnum.megabyte,
    amount: MAX_SIZE_VIDEO_MB,
});

const Component = ({
    isFileExists,
    onNextStep,
    isFileUploading,
    onFileUploaded,
}: UploadBackgroundProps) => {
    const generateFileUploadError = useCallback(
        (rejectedFiles: FileRejection[], total: number) => {
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

            const maxSize =
                fileType === 'image' ? MAX_SIZE_IMAGE : MAX_SIZE_VIDEO;
            const maxSizeMB =
                fileType === 'image' ? MAX_SIZE_IMAGE_MB : MAX_SIZE_VIDEO_MB;
            const isSizeExceeded = rejectedFile.size > maxSize;
            const isAcceptedMIME =
                fileType === 'image'
                    ? ACCEPT_MIMES_IMAGE[rejectedFile.type]
                    : ACCEPT_MIMES_VIDEO[rejectedFile.type];

            const notification: Notification = {
                type: NotificationType.UploadFileFail,
                messageOptions: {
                    max: maxSizeMB,
                },
                withErrorIcon: true,
                message: '',
            };

            if (isAcceptedMIME) {
                notification.message = `uploadBackground.${fileType}.maxSize`;
            } else if (!isAcceptedMIME && isSizeExceeded) {
                notification.message = `uploadBackground.${fileType}.general`;
            } else {
                notification.message = `uploadBackground.${fileType}.invalidFormat`;
            }

            addNotificationEvent(notification);
        },
        [],
    );

    const {
        control,
        formState: { errors },
        register,
        setError,
        setValue,
        clearErrors,
    } = useFormContext();

    const errorYoutubeUrl = errors?.youtubeUrl?.message ?? '';

    const youtubeUrl = useWatch({
        control,
        name: 'youtubeUrl',
    });

    const { onChange: onChangeYoutubeUrl, ...youtubeUrlProps } =
        register('youtubeUrl');

    const isHasYoutubeUrl = hasYoutubeUrlRegex.test(youtubeUrl);

    const { value: isShowBox, onSwitchOn, onSwitchOff } = useToggle(false);

    const handleSetFileData = useCallback(
        async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            const totalFiles = acceptedFiles.length + rejectedFiles.length;

            if (rejectedFiles.length || totalFiles > 1) {
                generateFileUploadError(
                    rejectedFiles,
                    acceptedFiles.length + rejectedFiles.length,
                );
                return;
            }

            const file = acceptedFiles[0];
            console.log(file);

            // return;

            if (ACCEPT_MIMES_IMAGE[file.type] && file.size > MAX_SIZE_IMAGE) {
                generateFileUploadError(
                    [
                        {
                            file,
                        },
                    ],
                    acceptedFiles.length + rejectedFiles.length,
                );
                return;
            }
            onSwitchOff();
            onFileUploaded(file);
        },
        [generateFileUploadError, onFileUploaded],
    );

    const handleChangeYoutubeUrl = (e: any) => {
        const newValue = e.target.value;
        if (!hasYoutubeUrlRegex.test(newValue)) {
            setError('youtubeUrl', {
                type: 'valid',
                message: 'Youtube Link is invalid',
            });
        } else {
            onSwitchOff();
            if (isFileExists) {
                setValue('background', undefined);
                setValue('url', '');
                updateCommonTemplateDataEvent({
                    draftUrl: '',
                    draftPreviewUrls: [],
                } as any);
            }

            if (errorYoutubeUrl) clearErrors('youtubeUrl');
        }
        onChangeYoutubeUrl(e);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        maxFiles: 1,
        maxSize: Math.max(MAX_SIZE_IMAGE, MAX_SIZE_VIDEO),
        accept: ACCEPT_MIMES,
        onDrop: handleSetFileData,
        noDrag: false,
    });

    const { onClick, ...rootProps } = getRootProps();

    const fallbackComponent = useMemo(
        () => (
            <>
                <CustomGrid
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                >
                    <ConditionalRender
                        condition={
                            (!isFileExists && !isHasYoutubeUrl) || isShowBox
                        }
                    >
                        <CustomGrid
                            container
                            direction="column"
                            alignItems="center"
                            justifyContent="flex-start"
                            className={styles.uploadDescription}
                            flex={1}
                            height={370}
                        >
                            <CustomTypography
                                className={styles.title}
                                variant="h2bold"
                            >
                                <Translation
                                    nameSpace="rooms"
                                    translation="uploadBackground.title"
                                />
                            </CustomTypography>
                            <CustomTypography
                                className={styles.description}
                                color="colors.grayscale.semidark"
                            >
                                <Translation
                                    nameSpace="rooms"
                                    translation="uploadBackground.description"
                                />
                            </CustomTypography>
                            <CustomTooltip
                                arrow
                                open
                                placement="bottom"
                                variant="black-glass"
                                title={
                                    <CustomGrid
                                        container
                                        direction="column"
                                        alignItems="center"
                                        gap={1}
                                    >
                                        <CustomTypography variant="body2bold">
                                            <Translation
                                                nameSpace="rooms"
                                                translation="uploadBackground.tip.title"
                                            />
                                        </CustomTypography>
                                        <CustomGrid
                                            item
                                            container
                                            direction="column"
                                            alignItems="center"
                                        >
                                            <CustomTypography variant="body2">
                                                <Translation
                                                    nameSpace="rooms"
                                                    translation="uploadBackground.tip.resolution"
                                                />
                                            </CustomTypography>
                                            <CustomTypography variant="body2">
                                                <Translation
                                                    nameSpace="rooms"
                                                    translation="uploadBackground.tip.imageRestricts"
                                                    options={{
                                                        maxSize:
                                                            MAX_SIZE_IMAGE_MB,
                                                    }}
                                                />
                                            </CustomTypography>
                                            <CustomTypography variant="body2">
                                                <Translation
                                                    nameSpace="rooms"
                                                    translation="uploadBackground.tip.videoRestricts"
                                                    options={{
                                                        maxSize:
                                                            MAX_SIZE_VIDEO_MB,
                                                    }}
                                                />
                                            </CustomTypography>
                                        </CustomGrid>
                                    </CustomGrid>
                                }
                                popperClassName={styles.popper}
                            >
                                <CustomButton
                                    label={
                                        <Translation
                                            nameSpace="rooms"
                                            translation="uploadBackground.actions.upload"
                                        />
                                    }
                                    className={styles.button}
                                    onClick={onClick}
                                />
                            </CustomTooltip>
                        </CustomGrid>
                    </ConditionalRender>
                    <ConditionalRender
                        condition={
                            (!isFileExists && !isFileUploading) || isShowBox
                        }
                    >
                        <CustomGrid
                            flex={1}
                            height={370}
                            display="flex"
                            direction="column"
                            justifyContent="flex-start"
                            alignItems="center"
                        >
                            <CustomTypography
                                variant="h2bold"
                                className={styles.title}
                            >
                                <Translation
                                    nameSpace="rooms"
                                    translation="youtubeBackground.title"
                                />
                            </CustomTypography>
                            <CustomTypography
                                color="colors.grayscale.semidark"
                                className={styles.description}
                            >
                                <Translation
                                    nameSpace="rooms"
                                    translation="youtubeBackground.description"
                                />
                            </CustomTypography>
                            <CustomPaper
                                variant="black-glass"
                                className={styles.paper}
                            >
                                <CustomGrid
                                    container
                                    gap={3}
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <CustomGrid
                                        display="flex"
                                        alignItems="center"
                                        gap={1}
                                    >
                                        <YoutubeIcon
                                            width="27px"
                                            height="27px"
                                        />
                                        <CustomTypography
                                            fontSize={15}
                                            color="colors.white.primary"
                                            fontWeight="bold"
                                            textAlign="center"
                                        >
                                            <Translation
                                                nameSpace="rooms"
                                                translation="youtubeVideo"
                                            />
                                        </CustomTypography>
                                    </CustomGrid>
                                    <CustomInput
                                        autoComplete="off"
                                        color="secondary"
                                        placeholder="Paste a Youtube link here"
                                        error={errorYoutubeUrl}
                                        {...youtubeUrlProps}
                                        onChange={handleChangeYoutubeUrl}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CopyLinkIcon
                                                        width="23px"
                                                        height="23px"
                                                        className={styles.icon}
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </CustomGrid>
                            </CustomPaper>
                        </CustomGrid>
                    </ConditionalRender>
                </CustomGrid>

                <ConditionalRender
                    condition={
                        isFileExists || isFileUploading || isHasYoutubeUrl
                    }
                >
                    <CustomGrid
                        container
                        gap={1.5}
                        flexWrap="nowrap"
                        justifyContent="center"
                        className={styles.buttonsGroup}
                    >
                        <CustomButton
                            isLoading={isFileUploading}
                            variant="custom-gray"
                            label={
                                <Translation
                                    nameSpace="rooms"
                                    translation="uploadBackground.actions.change"
                                />
                            }
                            className={styles.button}
                            onClick={onSwitchOn}
                        />
                        <ActionButton
                            variant="accept"
                            Icon={<ArrowRightIcon width="32px" height="32px" />}
                            className={styles.actionButton}
                            onAction={onNextStep}
                        />
                    </CustomGrid>
                </ConditionalRender>
            </>
        ),
        [
            isFileExists,
            isFileUploading,
            onFileUploaded,
            isHasYoutubeUrl,
            youtubeUrl,
            isShowBox,
        ],
    );

    return (
        <CustomGrid container className={clsx(styles.container)} {...rootProps}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <UploadDragFileOverlay title="uploadBackground.title" />
            ) : (
                fallbackComponent
            )}
        </CustomGrid>
    );
};

export const UploadBackground = memo(Component);
