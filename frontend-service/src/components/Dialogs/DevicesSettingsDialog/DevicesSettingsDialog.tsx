import React, { memo, useCallback, useContext, useEffect } from 'react';
import { useStore } from 'effector-react';

// custom components
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomSwitch } from '@library/custom/CustomSwitch/CustomSwitch';
import { CustomDivider } from '@library/custom/CustomDivider/CustomDivider';

// components
import { BackgroundBlurIcon } from '@library/icons/BackgroundBlurIcon';
import { FaceTrackingIcon } from '@library/icons/FaceTrackingIcon';
import { WiggleLoader } from '@library/common/WiggleLoader/WiggleLoader';
import { SelectDevices } from '@components/Media/SelectDevices/SelectDevices';
import { MediaPreview } from '@components/Media/MediaPreview/MediaPreview';

// controllers
import { AgoraController } from '../../../controllers/VideoChatController';

// context
import { MediaContext } from '../../../contexts/MediaContext';
import { VideoEffectsContext } from '../../../contexts/VideoEffectContext';

// store
import { $appDialogsStore, appDialogsApi } from '../../../store/dialogs';
import { $localUserStore, updateLocalUserStateEvent } from '../../../store/users';
import { $meetingStore } from '../../../store/meeting';
import { addNotificationEvent } from '../../../store/notifications';

// types
import { AppDialogsEnum, NotificationType } from '../../../store/types';

// styles
import styles from './DevicesSettingsDialog.module.scss';

const DevicesSettingsDialog = memo(() => {
    const { devicesSettingsDialog } = useStore($appDialogsStore);
    const localUser = useStore($localUserStore);
    const meeting = useStore($meetingStore);

    const isSharingScreenActive = localUser.meetingUserId === meeting.sharingUserId;

    const {
        data: { changeStream, error, videoDevices, audioDevices, isCameraActive, isMicActive },
        actions: { onToggleCamera, onToggleMic, onChangeActiveStream, onInitDevices },
    } = useContext(MediaContext);

    const {
        actions: { onGetCanvasStream, onToggleBlur, onToggleFaceTracking },
        data: { isBlurActive, isFaceTrackingActive },
    } = useContext(VideoEffectsContext);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.devicesSettingsDialog,
        });
    }, []);

    useEffect(() => {
        (async () => {
            if (devicesSettingsDialog) {
                await onInitDevices();
                onToggleCamera(localUser.cameraStatus !== 'inactive');
                onToggleMic(localUser.micStatus !== 'inactive');
            }
        })();
    }, [devicesSettingsDialog, localUser.cameraStatus, localUser.micStatus]);

    const handleSaveSettings = useCallback(async () => {
        handleClose();

        if (changeStream) {
            const newStream = onChangeActiveStream();

            const transformedStream = await onGetCanvasStream(newStream);

            if (transformedStream) {
                if (!meeting.sharingUserId) {
                    await AgoraController.setUpDevices(transformedStream);
                }

                AgoraController.setTracksState({
                    isCameraEnabled: isSharingScreenActive ? true : isCameraActive,
                    isMicEnabled: isMicActive,
                });
            }

            addNotificationEvent({
                type: NotificationType.DevicesAction,
                message: 'meeting.devices.saved',
            });

            updateLocalUserStateEvent({
                cameraStatus: isCameraActive ? 'active' : 'inactive',
                micStatus: isMicActive ? 'active' : 'inactive',
            });
        }
    }, [
        isCameraActive,
        isMicActive,
        changeStream,
        meeting.sharingUserId,
        isSharingScreenActive,
        isBlurActive,
        isFaceTrackingActive,
    ]);

    const isDevicesChecking = !(videoDevices.length && audioDevices.length) && !error;

    return (
        <CustomDialog open={devicesSettingsDialog} contentClassName={styles.wrapper}>
            <CustomGrid container direction="column">
                <CustomGrid container wrap="nowrap">
                    <MediaPreview stream={changeStream} />
                    <CustomDivider orientation="vertical" flexItem />
                    <CustomGrid
                        className={styles.devicesWrapper}
                        container
                        direction="column"
                        wrap="nowrap"
                        gap={2}
                    >
                        <CustomTypography
                            className={styles.title}
                            variant="h3bold"
                            nameSpace="meeting"
                            translation="settings"
                        />
                        {isDevicesChecking ? (
                            <WiggleLoader className={styles.loader} />
                        ) : (
                            <>
                                <SelectDevices />
                                <CustomGrid
                                    container
                                    gap={1}
                                    className={styles.backgroundBlurSetting}
                                >
                                    <BackgroundBlurIcon width="24px" height="24px" />
                                    <CustomTypography
                                        nameSpace="meeting"
                                        translation="features.blurBackground"
                                    />
                                    <CustomSwitch
                                        className={styles.switch}
                                        checked={isBlurActive}
                                        onChange={onToggleBlur}
                                    />
                                </CustomGrid>
                                <CustomGrid
                                    container
                                    gap={1}
                                    className={styles.backgroundBlurSetting}
                                >
                                    <FaceTrackingIcon width="24px" height="24px" />
                                    <CustomTypography
                                        nameSpace="meeting"
                                        translation="features.faceTracking"
                                    />
                                    <CustomSwitch
                                        className={styles.switch}
                                        checked={isFaceTrackingActive}
                                        onChange={onToggleFaceTracking}
                                    />
                                </CustomGrid>
                            </>
                        )}
                    </CustomGrid>
                </CustomGrid>
            </CustomGrid>
            <CustomButton
                onClick={handleSaveSettings}
                className={styles.saveSettings}
                nameSpace="meeting"
                translation="buttons.saveSettings"
            />
        </CustomDialog>
    );
});

export { DevicesSettingsDialog };
