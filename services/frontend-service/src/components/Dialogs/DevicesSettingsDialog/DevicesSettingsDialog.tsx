import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from 'effector-react';

// hooks
import { useToggle } from '@hooks/useToggle';

// custom components
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomDivider } from 'shared-frontend/library/custom/CustomDivider';

// components
import { MediaPreview } from '@components/Media/MediaPreview/MediaPreview';
import { MeetingSettingsContent } from '@components/Meeting/MeetingSettingsContent/MeetingSettingsContent';

// store
import { Translation } from '@library/common/Translation/Translation';
import {
    $avatarsMeetingStore,
    setAvatarTmpEvent,
} from 'src/store/roomStores/meeting/meetingAvatar/model';
import {
    $appDialogsStore,
    $profileStore,
    appDialogsApi,
    addNotificationEvent,
} from '../../../store';
import {
    $audioDevicesStore,
    $audioErrorStore,
    $backgroundAudioVolume,
    $changeStreamStore,
    $isAuraActive,
    $isBackgroundAudioActive,
    $isCameraActiveStore,
    $isMicActiveStore,
    $localUserStore,
    $meetingTemplateStore,
    $videoDevicesStore,
    $videoErrorStore,
    initDevicesEventFxWithStore,
    resetMediaStoreEvent,
    setActiveStreamEvent,
    setBackgroundAudioActive,
    setBackgroundAudioVolume,
    setIsAudioActiveEvent,
    setIsAuraActive,
    setIsCameraActiveEvent,
    updateLocalUserEvent,
    updateUserSocketEvent,
} from '../../../store/roomStores';

// types
import { AppDialogsEnum, NotificationType } from '../../../store/types';

// styles
import styles from './DevicesSettingsDialog.module.scss';

// validations
import { BackgroundManager } from '../../../helpers/media/applyBlur';
import { changeTracksState } from '../../../helpers/media/changeTrackState';

const Component = () => {
    const { devicesSettingsDialog } = useStore($appDialogsStore);
    const profile = useStore($profileStore);

    const localUser = useStore($localUserStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isBackgroundAudioActive = useStore($isBackgroundAudioActive);
    const backgroundAudioVolume = useStore($backgroundAudioVolume);
    const changeStream = useStore($changeStreamStore);
    const isCameraActive = useStore($isCameraActiveStore);
    const isMicActive = useStore($isMicActiveStore);
    const isAuraActive = useStore($isAuraActive);
    const videoDevices = useStore($videoDevicesStore);
    const audioDevices = useStore($audioDevicesStore);
    const videoError = useStore($videoErrorStore);
    const audioError = useStore($audioErrorStore);
    const {
        avatar: { list },
        avatarTmp,
    } = useStore($avatarsMeetingStore);

    const [volume, setVolume] = useState<number>(backgroundAudioVolume);
    const isFirstime = useRef(true);

    const {
        value: isSettingsAudioBackgroundActive,
        onToggleSwitch: handleToggleBackgroundAudio,
        onSetSwitch: handleSetBackgroundAudio,
    } = useToggle(isBackgroundAudioActive);

    const {
        value: isAuraEnabled,
        onToggleSwitch: handleToggleAura,
        onSetSwitch: handleSetAura,
    } = useToggle(isAuraActive);

    const {
        value: isNewCameraSettingActive,
        onToggleSwitch: handleToggleNewCameraSetting,
        onSwitchOff: handleOffCamera,
        onSetSwitch: handleSetCamera,
    } = useToggle(isCameraActive);

    const {
        value: isNewMicSettingActive,
        onToggleSwitch: handleToggleNewMicSetting,
        onSetSwitch: handleSetMic,
    } = useToggle(isMicActive);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.devicesSettingsDialog,
        });

        handleSetBackgroundAudio(isBackgroundAudioActive);
        handleSetAura(isAuraActive);
        setVolume(backgroundAudioVolume);
        handleSetCamera(isCameraActive);
        handleSetMic(isMicActive);
        resetMediaStoreEvent();
        isFirstime.current = true;
    }, [
        isBackgroundAudioActive,
        backgroundAudioVolume,
        isAuraActive,
        isMicActive,
        isCameraActive,
    ]);

    useEffect(() => {
        if (avatarTmp) {
            handleOffCamera();
            if (isFirstime.current) isFirstime.current = false;
        }
    }, [avatarTmp]);

    useEffect(() => {
        (async () => {
            if (devicesSettingsDialog) {
                await initDevicesEventFxWithStore();
            }
        })();
        if (devicesSettingsDialog)
            setAvatarTmpEvent(localUser.meetingAvatarId ?? '');
    }, [devicesSettingsDialog]);

    useEffect(() => {
        setVolume(backgroundAudioVolume);
    }, [backgroundAudioVolume]);

    const handleToggleCamera = useCallback(() => {
        changeTracksState({
            enabled: !isNewCameraSettingActive,
            tracks: changeStream?.getVideoTracks() ?? [],
        });
        handleToggleNewCameraSetting();
    }, [changeStream, isNewCameraSettingActive]);

    const handleToggleMic = useCallback(() => {
        changeTracksState({
            enabled: !isNewMicSettingActive,
            tracks: changeStream?.getAudioTracks() ?? [],
        });
        handleToggleNewMicSetting();
    }, [isNewMicSettingActive, changeStream]);

    const handleSaveSettings = useCallback(async () => {
        if (changeStream) {
            updateLocalUserEvent({
                isAuraActive: isAuraEnabled,
                meetingAvatarId: avatarTmp ?? undefined,
            });
            setIsCameraActiveEvent(isNewCameraSettingActive);
            setIsAudioActiveEvent(isNewMicSettingActive);

            await updateUserSocketEvent({
                isAuraActive: isAuraEnabled,
                meetingAvatarId: avatarTmp ?? undefined,
            });

            if (isAuraEnabled) {
                const clonedStream = changeStream?.clone();

                BackgroundManager.applyBlur(clonedStream);
                const streamWithBackground = await BackgroundManager.onBlur(
                    clonedStream,
                    isAuraEnabled,
                );

                setActiveStreamEvent(streamWithBackground);
            } else {
                setActiveStreamEvent(changeStream.clone());
            }

            setIsAuraActive(isAuraEnabled);
            setBackgroundAudioVolume(volume);
            setBackgroundAudioActive(isSettingsAudioBackgroundActive);

            appDialogsApi.closeDialog({
                dialogKey: AppDialogsEnum.devicesSettingsDialog,
            });

            addNotificationEvent({
                type: NotificationType.DevicesAction,
                message: 'meeting.devices.saved',
            });
        }
    }, [
        isNewCameraSettingActive,
        isNewMicSettingActive,
        changeStream,
        volume,
        isSettingsAudioBackgroundActive,
        isAuraEnabled,
        isAuraActive,
        avatarTmp,
    ]);

    return (
        <CustomDialog
            open={devicesSettingsDialog}
            contentClassName={styles.wrapper}
            onClose={handleClose}
            id="anchor-unlock"
        >
            <CustomGrid container direction="column">
                <CustomGrid container wrap="nowrap">
                    <MediaPreview
                        videoError={videoError}
                        audioError={audioError}
                        videoDevices={videoDevices}
                        audioDevices={audioDevices}
                        isCameraActive={isNewCameraSettingActive}
                        isMicActive={isNewMicSettingActive}
                        onToggleVideo={handleToggleCamera}
                        onToggleAudio={handleToggleMic}
                        stream={changeStream}
                        profileAvatar={
                            avatarTmp
                                ? list.find(item => item.id === avatarTmp)
                                      ?.resouce?.url
                                : isFirstime.current &&
                                  localUser.meetingAvatarId
                                ? list.find(
                                      item =>
                                          item.id === localUser.meetingAvatarId,
                                  )?.resouce?.url
                                : profile.profileAvatar?.url
                        }
                        userName={localUser?.username}
                        devicesSettingsDialog={devicesSettingsDialog}
                    />
                    <CustomDivider orientation="vertical" flexItem />
                    <CustomGrid
                        className={styles.devicesWrapper}
                        container
                        direction="column"
                        wrap="nowrap"
                        gap={2}
                    >
                        <MeetingSettingsContent
                            stream={changeStream}
                            isBackgroundActive={isSettingsAudioBackgroundActive}
                            onBackgroundToggle={handleToggleBackgroundAudio}
                            backgroundVolume={volume}
                            onChangeBackgroundVolume={setVolume}
                            isAuraActive={isAuraEnabled}
                            onToggleAura={handleToggleAura}
                            isAudioActive={meetingTemplate.isAudioAvailable}
                            title={
                                <CustomTypography
                                    className={styles.title}
                                    variant="h3bold"
                                    nameSpace="meeting"
                                    translation="settings.main"
                                />
                            }
                            isCamera={isNewCameraSettingActive}
                            isMicrophone={isNewMicSettingActive}
                            onToggleCamera={handleToggleCamera}
                            onToggleMicrophone={handleToggleMic}
                        />
                    </CustomGrid>
                </CustomGrid>
            </CustomGrid>
            <CustomButton
                onClick={handleSaveSettings}
                className={styles.saveSettings}
                label={
                    <Translation
                        nameSpace="meeting"
                        translation="buttons.saveSettings"
                    />
                }
            />
        </CustomDialog>
    );
};

export const DevicesSettingsDialog = memo(Component);
