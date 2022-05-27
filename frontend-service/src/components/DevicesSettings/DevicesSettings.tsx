import React, { memo, useCallback, useContext, useState } from 'react';
import { useStore } from 'effector-react';

// helpers

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomDivider } from '@library/custom/CustomDivider/CustomDivider';

// components
import { WiggleLoader } from '@library/common/WiggleLoader/WiggleLoader';
import { MediaPreview } from '@components/Media/MediaPreview/MediaPreview';
import { MeetingSettingsContent } from '@components/Meeting/MeetingSettingsContent/MeetingSettingsContent';
import { useToggle } from '../../hooks/useToggle';

// context
import {VideoEffectsContext} from "../../contexts/VideoEffectContext";

// context
import { MediaContext } from '../../contexts/MediaContext';

// stores
import {
    $isMeetingInstanceExists,
    $isOwner,
    $isOwnerInMeeting,
    $isUserSendEnterRequest,
    emitCancelEnterMeetingEvent,
    emitEnterMeetingEvent,
    emitStartMeetingEvent,
    setIsUserSendEnterRequest,
} from '../../store/meeting';
import { updateLocalUserStateEvent } from '../../store/users';
import { addNotificationEvent } from '../../store/notifications';
import { emitSendEnterWaitingRoom } from '../../store/waitingRoom';

// types
import { NotificationType } from '../../store/types';

// styles
import styles from './DevicesSettings.module.scss';
import {
    $backgroundAudioVolume,
    $isBackgroundAudioActive,
    setBackgroundAudioActive,
    setBackgroundAudioVolume,
} from '../../store/other';

const DevicesSettings = memo(() => {
    const isOwner = useStore($isOwner);
    const isOwnerInMeeting = useStore($isOwnerInMeeting);
    const isMeetingInstanceExists = useStore($isMeetingInstanceExists);
    const isUserSentEnterRequest = useStore($isUserSendEnterRequest);
    const isAudioBackgroundActive = useStore($isBackgroundAudioActive);
    const backgroundAudioVolume = useStore($backgroundAudioVolume);

    const [volume, setVolume] = useState(backgroundAudioVolume);

    const { value: isBackgroundAudioActive, onToggleSwitch: handleToggleBackgroundAudio } =
        useToggle(isAudioBackgroundActive);

    const {
        data: {
            isStreamRequested,
            changeStream,
            error,
            isMicActive,
            isCameraActive,
            audioDevices,
            videoDevices,
        },
    } = useContext(MediaContext);

    const { data: { isBlurActive } } = useContext(VideoEffectsContext);

    const handleToggleMic = useCallback(() => {
        if (changeStream) {
            addNotificationEvent({
                type: NotificationType.MicAction,
                message: `meeting.mic.${!isMicActive ? 'on' : 'off'}`,
            });
            updateLocalUserStateEvent({
                micStatus: !isMicActive ? 'active' : 'inactive',
            });
        }
    }, [changeStream, isMicActive, error]);

    const handleToggleCamera = useCallback(() => {
        if (changeStream) {
            addNotificationEvent({
                type: NotificationType.CamAction,
                message: `meeting.cam.${!isCameraActive ? 'on' : 'off'}`,
            });
            updateLocalUserStateEvent({
                cameraStatus: !isCameraActive ? 'active' : 'inactive',
            });
        }
    }, [changeStream, isCameraActive, error]);

    const handleJoinMeeting = useCallback(async () => {
        if (!isStreamRequested) {
            if ((!changeStream && error === 'media.notAllowed') || (changeStream && !error)) {
                updateLocalUserStateEvent({
                    isAuraActive: isBlurActive
                });

                if (isOwner) {
                    emitStartMeetingEvent();
                } else {
                    if (isMeetingInstanceExists && isOwnerInMeeting) {
                        emitEnterMeetingEvent();
                    } else {
                        emitSendEnterWaitingRoom();
                    }
                    setIsUserSendEnterRequest(true);
                }

                setBackgroundAudioVolume(volume);
                setBackgroundAudioActive(isBackgroundAudioActive);
            } else {
                handleToggleCamera();
            }
        }
    }, [
        isOwner,
        changeStream,
        error,
        isStreamRequested,
        isMeetingInstanceExists,
        isOwnerInMeeting,
        volume,
        isBackgroundAudioActive,
        isBlurActive,
    ]);

    const handleCancelRequest = useCallback(async () => {
        emitCancelEnterMeetingEvent();
        setIsUserSendEnterRequest(false);
    }, []);

    const handleChangeVolume = useCallback(newVolume => {
        setVolume(() => newVolume);
    }, []);

    return (
        <CustomPaper className={styles.wrapper}>
            <CustomGrid container direction="column">
                <CustomGrid container wrap="nowrap" className={styles.settingsContent}>
                    <MediaPreview
                        stream={changeStream}
                        onToggleAudio={handleToggleMic}
                        onToggleVideo={handleToggleCamera}
                    />
                    <CustomDivider orientation="vertical" flexItem />
                    <CustomGrid
                        className={styles.devicesWrapper}
                        container
                        direction="column"
                        wrap="nowrap"
                    >
                        {isUserSentEnterRequest ||
                        (!(videoDevices.length && audioDevices.length) && !error) ? (
                            <>
                                <CustomTypography
                                    className={styles.title}
                                    variant="h3bold"
                                    nameSpace="meeting"
                                    translation="requestSent"
                                />
                                <CustomTypography
                                    variant="body1"
                                    color="text.secondary"
                                    nameSpace="meeting"
                                    translation="enterPermission"
                                />
                                <CustomGrid
                                    container
                                    alignItems="center"
                                    className={styles.loader}
                                    gap={1}
                                >
                                    <WiggleLoader />
                                    <CustomTypography
                                        color="colors.orange.primary"
                                        nameSpace="meeting"
                                        translation="waitForHost"
                                    />
                                </CustomGrid>
                            </>
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
                                        translation="readyToJoin"
                                    />
                                }
                            />
                        )}
                    </CustomGrid>
                </CustomGrid>
            </CustomGrid>
            <CustomButton
                onClick={isUserSentEnterRequest ? handleCancelRequest : handleJoinMeeting}
                className={styles.joinBtn}
                nameSpace="meeting"
                variant={isUserSentEnterRequest ? 'custom-cancel' : 'custom-primary'}
                translation={isUserSentEnterRequest ? 'buttons.cancel' : 'buttons.join'}
            />
        </CustomPaper>
    );
});

export { DevicesSettings };
