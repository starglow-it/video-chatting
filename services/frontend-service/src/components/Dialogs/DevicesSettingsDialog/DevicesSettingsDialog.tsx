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
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { MEDIA_CONSTRAINTS_CANNOT_BE_SATISFIED, MEDIA_DEVICE_NOT_ACCESSIBLE, MEDIA_DEVICE_NOT_FOUND, MEDIA_GENERAL_ERROR, MEDIA_INVALID_CONSTRAINTS, MEDIA_NOT_ALLOWED_BY_BROWSER, MEDIA_NOT_ALLOWED_BY_SYSTEM, MEDIA_OPERATION_ABORTED, MEDIA_SECURITY_ERROR } from 'src/helpers/media/getMediaStream';
import { useBrowserDetect } from '@hooks/useBrowserDetect';

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
    const isAudioError = Boolean(audioError);
    const isVideoError = Boolean(videoError);
    const [showDeviceError, setShowDeviceError] = useState("");
    const { isMobile } = useBrowserDetect();

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

    useEffect(() => {
        if (isAudioError) {
            setIsAudioActiveEvent(false); // This assumes setIsAudioActiveEvent will set isMicActive to false
        }
    }, [isAudioError]);

    useEffect(() => {
        if (isVideoError) {
            setIsCameraActiveEvent(false); // This assumes setIsCameraActiveEvent will set isCameraActive to false
        }
    }, [isVideoError]);

    const handleToggleCamera = useCallback(() => {
        if (isVideoError) {
            addNotificationEvent({
                type: NotificationType.CamAction,
                message: `meeting.deviceErrors.${videoError?.type}`,
            });
            setShowDeviceError('video');
        } else {
            changeTracksState({
                enabled: !isNewCameraSettingActive,
                tracks: changeStream?.getVideoTracks() ?? [],
            });
            handleToggleNewCameraSetting();
        }
    }, [changeStream, isNewCameraSettingActive]);

    const handleToggleMic = useCallback(() => {
        if (isAudioError) {
            addNotificationEvent({
                type: NotificationType.MicAction,
                message: `meeting.deviceErrors.${audioError?.type}`,
            });
            setShowDeviceError('audio');
        } else {
            changeTracksState({
                enabled: !isNewMicSettingActive,
                tracks: changeStream?.getAudioTracks() ?? [],
            });
            handleToggleNewMicSetting();
        }
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
                cameraStatus: isNewCameraSettingActive ? 'active' : 'inactive',
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

    const renderErrorContent = (src: string, translationKey: string) => (
        <>
            <ConditionalRender condition={Boolean(src)}>
                <CustomImage
                    src={src}
                    width={10}
                    height={100}
                    unoptimized={false}
                    objectFit="contain"
                />
            </ConditionalRender>
            <CustomTypography
                textAlign="center"
                fontSize={14}
                nameSpace="meeting"
                translation={translationKey}
                className={styles.devicesError}
            />
        </>
    );

    const openSystemSettings = (): void => {
        const userAgent: string = navigator.userAgent;
        const deviceSetting = showDeviceError === "video" ? 'camera' : 'microphone';

        let preferencesURI: string;

        if (/Mac|Macintosh|OS X/.test(userAgent)) {
            const macSetting = deviceSetting === 'camera' ? 'Privacy_Camera' : 'Privacy_Microphone';
            preferencesURI = `x-apple.systempreferences:com.apple.preference.security?${macSetting}`;
        } else if (/Windows/.test(userAgent)) {
            const windowsSetting = deviceSetting === 'camera' ? 'webcam' : 'microphone';
            preferencesURI = `ms-settings:privacy-${windowsSetting}`;
        } else {
            // Default to Linux or other OS
            preferencesURI = `gnome-control-center ${deviceSetting}`;
        }

        openPreferences(preferencesURI);
    };
    const openPreferences = (preferencesURI: string): void => {
        try {
            window.open(preferencesURI);
        } catch (error) {
            console.error("Failed to open preferences:", error);
        }
    };

    const determineRenderContent = () => {
        if (showDeviceError == "") {
            return;
        }
        const error = showDeviceError == "audio" ? audioError : videoError;
        if (error?.type == MEDIA_NOT_ALLOWED_BY_BROWSER) {
            return renderErrorContent("/images/reset-permission.gif", "allowAccess.desktop.allowDevice");
        }

        if (error?.type == MEDIA_NOT_ALLOWED_BY_SYSTEM) {
            return (
                <>
                    <CustomTypography
                        textAlign="center"
                        fontSize={14}
                        nameSpace="meeting"
                        translation="allowAccess.desktop.allowChromeDescription"
                        className={styles.devicesError}
                    />
                    {renderErrorContent("", "allowAccess.desktop.allowChrome")}
                    <CustomGrid
                        container
                        gap={1}
                        wrap="nowrap" className={styles.openSystemSettingsButton}>
                        <CustomButton
                            onClick={openSystemSettings}
                            variant="custom-primary"
                            label={
                                <Translation
                                    nameSpace="common"
                                    translation="buttons.openSystemSettings"
                                />
                            }
                        />
                    </CustomGrid>
                </>
            );
        }

        if (error?.type == MEDIA_DEVICE_NOT_FOUND) {
            return renderErrorContent("", "allowAccess.desktop.notFoundDevice");
        }

        if (error?.type == MEDIA_GENERAL_ERROR) {
            return renderErrorContent("", "allowAccess.desktop.errorDevice");
        }
        if (error?.type == MEDIA_OPERATION_ABORTED ||
            error?.type == MEDIA_DEVICE_NOT_ACCESSIBLE ||
            error?.type == MEDIA_CONSTRAINTS_CANNOT_BE_SATISFIED ||
            error?.type == MEDIA_SECURITY_ERROR ||
            error?.type == MEDIA_INVALID_CONSTRAINTS) {
            return renderErrorContent("", error?.message || "");
        }
    };


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
                        videoError={videoError || undefined}
                        audioError={audioError || undefined}
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
            <CustomGrid container direction="column" wrap="nowrap" className={styles.errorContent}>
                <ConditionalRender condition={isAudioError || isVideoError}>
                    {determineRenderContent()}
                    <ConditionalRender condition={isMobile}>
                        <CustomImage
                            src="/images/reload.svg"
                            width={10}
                            height={85}
                            objectFit="contain"
                            onClick={() => window.location.reload()}
                        />
                        <CustomTypography
                            textAlign="center"
                            fontSize={14}
                            nameSpace="meeting"
                            translation="allowAccess.mobile"
                            className={styles.devicesError}
                        />

                    </ConditionalRender>
                </ConditionalRender>
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
