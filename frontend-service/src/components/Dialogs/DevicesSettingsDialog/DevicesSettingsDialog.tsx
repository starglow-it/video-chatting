import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { useStore } from 'effector-react';

// hooks

// custom components
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomDivider } from '@library/custom/CustomDivider/CustomDivider';

// components
import { WiggleLoader } from '@library/common/WiggleLoader/WiggleLoader';
import { MediaPreview } from '@components/Media/MediaPreview/MediaPreview';
import { MeetingSettingsContent } from '@components/Meeting/MeetingSettingsContent/MeetingSettingsContent';
import { useToggle } from '../../../hooks/useToggle';

// controllers
import { AgoraController } from '../../../controllers/VideoChatController';

// context
import { MediaContext } from '../../../contexts/MediaContext';
import { VideoEffectsContext } from '../../../contexts/VideoEffectContext';

// store
import { $appDialogsStore, appDialogsApi } from '../../../store/dialogs';
import {$localUserStore, emitUpdateUserEvent, updateLocalUserStateEvent} from '../../../store/users';
import { $meetingStore } from '../../../store/meeting';
import { addNotificationEvent } from '../../../store/notifications';
import {
    $backgroundAudioVolume,
    $isBackgroundAudioActive,
    setBackgroundAudioActive,
    setBackgroundAudioVolume,
} from '../../../store/other';

// types
import { AppDialogsEnum, NotificationType } from '../../../store/types';

// styles
import styles from './DevicesSettingsDialog.module.scss';

const DevicesSettingsDialog = memo(() => {
    const { devicesSettingsDialog } = useStore($appDialogsStore);
    const localUser = useStore($localUserStore);
    const meeting = useStore($meetingStore);

    const isAudioBackgroundActive = useStore($isBackgroundAudioActive);
    const backgroundAudioVolume = useStore($backgroundAudioVolume);

    const [volume, setVolume] = useState(backgroundAudioVolume);

    const { value: isBackgroundAudioActive, onToggleSwitch: handleToggleBackgroundAudio } =
        useToggle(isAudioBackgroundActive);

    const isSharingScreenActive = localUser.meetingUserId === meeting.sharingUserId;

    const {
        data: { changeStream, error, videoDevices, audioDevices, isCameraActive, isMicActive },
        actions: { onToggleCamera, onToggleMic, onChangeActiveStream, onInitDevices },
    } = useContext(MediaContext);

    const {
        actions: { onGetCanvasStream },
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

            updateLocalUserStateEvent({
                cameraStatus: isCameraActive ? 'active' : 'inactive',
                micStatus: isMicActive ? 'active' : 'inactive',
                isAuraActive: isBlurActive
            });

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

            emitUpdateUserEvent({ isAuraActive: isBlurActive });

            setBackgroundAudioVolume(volume);
            setBackgroundAudioActive(isBackgroundAudioActive);
        }
    }, [
        isCameraActive,
        isMicActive,
        changeStream,
        meeting.sharingUserId,
        isSharingScreenActive,
        isBlurActive,
        isFaceTrackingActive,
        volume,
        isBackgroundAudioActive,
    ]);

    const isDevicesChecking = !(videoDevices.length && audioDevices.length) && !error;

    const handleChangeVolume = useCallback(newVolume => {
        setVolume(() => newVolume);
    }, []);

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
                        {isDevicesChecking ? (
                            <WiggleLoader className={styles.loader} />
                        ) : (
                            <MeetingSettingsContent
                                stream={changeStream}
                                volume={volume}
                                onChangeVolume={handleChangeVolume}
                                isBackgroundAudioActive={isBackgroundAudioActive}
                                onToggleAudioBackground={handleToggleBackgroundAudio}
                                title={
                                    <CustomTypography
                                        className={styles.title}
                                        variant="h3bold"
                                        nameSpace="meeting"
                                        translation="settings.main"
                                    />
                                }
                            />
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
