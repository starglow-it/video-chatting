import { memo, useCallback } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useFormContext, useWatch } from 'react-hook-form';
import { useStore } from 'effector-react';
import clsx from 'clsx';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';

// components
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// icons
import { ArrowUp } from 'shared-frontend/icons/OtherIcons/ArrowUp';
import { ArrowRightIcon } from 'shared-frontend/icons/OtherIcons/ArrowRightIcon';

// types
import { IUploadTemplateFormData } from '@containers/CreateRoomContainer/types';
import { UploadTemplateFileProps } from '@components/TemplateManagement/UploadTemplateFile/types';
import { Translation } from '@library/common/Translation/Translation';

// const

// store

// style
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { InputAdornment } from '@mui/material';
import { CopyLinkIcon } from 'shared-frontend/icons/OtherIcons/CopyLinkIcon';
import { hasYoutubeUrlRegex } from 'shared-frontend/const/regexp';
import { YoutubeIcon } from 'shared-frontend/icons/OtherIcons/YoutubeIcon';
import Paper from '@mui/material/Paper';
import { useToggle } from '@hooks/useToggle';
import styles from './UploadTemplateFile.module.scss';
import {
    $isUploadTemplateBackgroundInProgress,
    addNotificationEvent,
    uploadUserTemplateFileFx,
} from '../../../store';
import {
    ACCEPT_MIMES,
    ACCEPT_MIMES_IMAGE,
    ACCEPT_MIMES_VIDEO,
    MAX_SIZE_IMAGE,
    MAX_SIZE_IMAGE_MB,
    MAX_SIZE_VIDEO,
    MAX_SIZE_VIDEO_MB,
} from '../../../const/templates/file';
import { Notification, NotificationType } from '../../../store/types';

const Component = ({ onNextStep }: UploadTemplateFileProps) => {
    const {
        setValue,
        control,
        register,
        setError,
        clearErrors,
        formState: { errors },
    } = useFormContext<IUploadTemplateFormData>();

    const background = useWatch<IUploadTemplateFormData>({
        control,
        name: 'background',
    });
    const url = useWatch<IUploadTemplateFormData>({ control, name: 'url' });

    const { onChange: onChangeYoutubeUrl, ...youtubeUrlProps } =
        register('youtubeUrl');

    const youtubeUrl = useWatch<IUploadTemplateFormData>({
        control,
        name: 'youtubeUrl',
    });

    const isUploadTemplateFilePending = useStore(
        $isUploadTemplateBackgroundInProgress,
    );
    const isUpdateMeetingTemplateFilePending = useStore(
        uploadUserTemplateFileFx.pending,
    );

    const { value: isShowBox, onSwitchOn, onSwitchOff } = useToggle(false);

    const generateFileUploadError = useCallback(
        (rejectedFiles: FileRejection[], total: number) => {
            if (!rejectedFiles.length) {
                return;
            }
            onSwitchOff();

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
        },
        [],
    );

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

            if (ACCEPT_MIMES_IMAGE[file.type] && file.size > MAX_SIZE_IMAGE) {
                generateFileUploadError(
                    [{ file }],
                    acceptedFiles.length + rejectedFiles.length,
                );
                return;
            }
            onSwitchOff();
            setValue('background', file);
            setValue('youtubeUrl', '');
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

    const errorYoutubeUrl = errors?.youtubeUrl?.message ?? '';

    const isHasYoutubeUrl = hasYoutubeUrlRegex.test(youtubeUrl);

    const handleChangeYoutubeUrl = (e: any) => {
        const newValue = e.target.value;
        if (!hasYoutubeUrlRegex.test(newValue)) {
            setError('youtubeUrl', {
                type: 'valid',
                message: 'Youtube Link is invalid',
            });
        } else {
            if (url && background) {
                setValue('background', undefined);
                setValue('url', '');
            }

            errorYoutubeUrl && clearErrors('youtubeUrl');
        }
        onChangeYoutubeUrl(e);
    };

    return (
        <CustomGrid
            container
            className={clsx(styles.container, {
                [styles.active]: isDragActive,
            })}
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
                        <ArrowUp
                            width="20px"
                            height="25px"
                            className={styles.icon}
                        />
                    </CustomGrid>
                    <CustomTypography
                        variant="h2bold"
                        nameSpace="createRoom"
                        color="colors.white.primary"
                        translation="uploadBackground.title"
                    />
                </CustomGrid>
            </ConditionalRender>
            <ConditionalRender condition={
                !isDragActive &&
                (!url && !background && !isHasYoutubeUrl) &&
                (!isUploadTemplateFilePending &&
                    !isUpdateMeetingTemplateFilePending &&
                    !url &&
                    !background) ||
                isShowBox
            }>
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="flex-start"
                    direction="column"
                    gap={10}
                    className={styles.uploadBackground}
                >
                    <Paper
                        className={styles.uploadBackgroundContentWrapper}
                    >
                        <CustomGrid
                            container
                            direction="row"
                            alignItems="flex-start"
                            justifyContent="center"
                            className={styles.innerUploadBackgroundContent}
                        >
                            <ConditionalRender
                                condition={
                                    (!url && !background && !isHasYoutubeUrl) ||
                                    isShowBox
                                }
                            >
                                <CustomGrid
                                    container
                                    flex={1}
                                    display="flex"
                                    direction="column"
                                    alignItems="center"
                                    justifyContent="flex-start"
                                    className={styles.uploadDescription}
                                >
                                    <CustomTypography
                                        color="colors.grayscale.semidark"
                                        nameSpace="createRoom"
                                        translation="uploadBackground.description"
                                        className={styles.description}
                                    />
                                    <CustomButton
                                        label={
                                            <Translation
                                                nameSpace="createRoom"
                                                translation="uploadBackground.actions.upload"
                                            />
                                        }
                                        className={styles.uploadButton}
                                        onClick={onClick}
                                    />
                                    <CustomGrid
                                        container
                                        direction="column"
                                        alignItems="center"
                                        gap={1}
                                        className={styles.uploadBackgroundDescription}
                                    >
                                        <CustomGrid
                                            item
                                            container
                                            direction="column"
                                            alignItems="center"
                                        >
                                            <CustomTypography
                                                variant="body2"
                                                nameSpace="createRoom"
                                                translation="uploadBackground.tip.resolution"
                                            />
                                            <CustomTypography
                                                variant="body2"
                                                nameSpace="createRoom"
                                                translation="uploadBackground.tip.imageRestricts"
                                                options={{
                                                    maxSize: MAX_SIZE_IMAGE_MB,
                                                }}
                                            />
                                            <CustomTypography
                                                variant="body2"
                                                nameSpace="createRoom"
                                                translation="uploadBackground.tip.videoRestricts"
                                                options={{
                                                    maxSize: MAX_SIZE_VIDEO_MB,
                                                }}
                                            />
                                        </CustomGrid>
                                    </CustomGrid>
                                </CustomGrid>
                            </ConditionalRender>
                            <ConditionalRender
                                condition={
                                    (!isUploadTemplateFilePending &&
                                        !isUpdateMeetingTemplateFilePending &&
                                        !url &&
                                        !background) ||
                                    isShowBox
                                }
                            >
                                <CustomGrid
                                    container
                                    flex={1}
                                    display="flex"
                                    direction="column"
                                    justifyContent="flex-start"
                                    alignItems="center"
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
                                            <CustomTypography
                                                nameSpace="meeting"
                                                translation="connect"
                                                fontSize={18}
                                                color="colors.white.primary"
                                                textAlign="center"
                                            />
                                            <YoutubeIcon
                                                width="27px"
                                                height="27px"
                                            />
                                            <CustomTypography
                                                nameSpace="meeting"
                                                translation="youtubeVideo"
                                                fontSize={18}
                                                color="colors.white.primary"
                                                textAlign="center"
                                            />
                                        </CustomGrid>
                                        <CustomInput
                                            autoComplete="off"
                                            color="secondary"
                                            placeholder="paste a youtube link here"
                                            error={errorYoutubeUrl}
                                            {...youtubeUrlProps}
                                            onChange={handleChangeYoutubeUrl}
                                            className={styles.youtubeInputWrapper}
                                            size="small"
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
                                </CustomGrid>
                            </ConditionalRender>
                        </CustomGrid>
                    </Paper>
                </CustomGrid>
            </ConditionalRender>

            <ConditionalRender
                condition={
                    Boolean(background) || Boolean(url) || isHasYoutubeUrl
                }
            >
                <CustomGrid
                    container
                    gap={1.5}
                    flexWrap="nowrap"
                    justifyContent="center"
                    className={styles.buttonsGroup}
                >
                    <ConditionalRender
                        condition={
                            !isUploadTemplateFilePending &&
                            !isUpdateMeetingTemplateFilePending
                        }
                    >
                        <CustomButton
                            variant="custom-gray"
                            label={
                                <Translation
                                    nameSpace="createRoom"
                                    translation="uploadBackground.actions.change"
                                />
                            }
                            className={styles.button}
                            onClick={onSwitchOn}
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
