import React, {memo, useCallback, useContext, useEffect} from 'react';
import {useStore} from 'effector-react';
import Image from 'next/image';

// helpers
import {usePrevious} from 'src/hooks/usePrevious';

// custom
import {CustomGrid} from '@library/custom/CustomGrid/CustomGrid';

// components
import {MeetingControlPanel} from '@components/Meeting/MeetingControlPanel/MeetingControlPanel';
import {MeetingUsersVideos} from '@components/Meeting/MeetingUsersVideos/MeetingUsersVideos';
import {MeetingEndControls} from '@components/Meeting/MeetingEndControls/MeetingEndControls';
import {MeetingNotes} from '@components/Meeting/MeetingNotes/MeetingNotes';
import {MeetingSettingsPanel} from '@components/Meeting/MeetingSettingsPanel/MeetingSettingsPanel';
import {MeetingGeneralInfo} from '@components/Meeting/MeetingGeneralInfo/MeetingGeneralInfo';
import {MeetingBackgroundVideo} from '@components/Meeting/MeetingBackgroundVideo/MeetingBackgroundVideo';
import {MeetingSounds} from "@components/Meeting/MeetingSounds/MeetingSounds";
import {DevicesSettingsDialog} from '@components/Dialogs/DevicesSettingsDialog/DevicesSettingsDialog';
import {EndMeetingDialog} from '@components/Dialogs/EndMeetingDialog/EndMeetingDialog';
import {InviteAttendeeDialog} from '@components/Dialogs/InviteAttendeeDialog/InviteAttendeeDialog';
import {UserToKickDialog} from '@components/Dialogs/UserToKickDialog/UserToKickDialog';
import {AudioDeviceSetUpButton} from '@components/Media/DeviceSetUpButtons/AudioDeviceSetUpButton';
import {VideoDeviceSetUpButton} from '@components/Media/DeviceSetUpButtons/VideoDeviceSetUpButton';
import {ScreenSharingButton} from '@components/Meeting/ScreenSharingButton/ScreenSharingButton';
import {ScreenSharingLayout} from '@components/Meeting/ScreenSharingLayout/ScreenSharingLayout';
import {CopyMeetingLinkDialog} from "@components/Dialogs/CopyMeetingLinkDialog/CopyMeetingLinkDialog";
import {BackgroundAudioControl} from "@components/Meeting/BackgroundAudioControl/BackgroundAudioControl";
import {emptyFunction} from '../../../utils/functions/emptyFunction';

// misc
import {AgoraController} from '../../../controllers/VideoChatController';

// context
import {MediaContext} from '../../../contexts/MediaContext';
import {VideoEffectsContext} from '../../../contexts/VideoEffectContext';

// styles
import styles from './MeetingView.module.scss';

// stores
import {
    $isOwner,
    $meetingStore,
    $meetingTemplateStore,
    $localUserStore,
    setLocalUserMediaEvent,
    setMeetingUserMediaEvent,
    updateLocalUserEvent,
    updateMeetingSocketEvent,
    updateMeetingTemplateFxWithData,
    updateUserSocketEvent,
    appDialogsApi
} from '../../../store';

// types
import {AppDialogsEnum, MeetingAccessStatuses} from '../../../store/types';

const MeetingView = memo(() => {
    const meeting = useStore($meetingStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const localUser = useStore($localUserStore);
    const isOwner = useStore($isOwner);

    const isLocalMicActive = localUser.micStatus === 'active';
    const isLocalCamActive = localUser.cameraStatus === 'active';

    const isSharingScreenActive = localUser.meetingUserId === meeting.sharingUserId;

    const {
        data: { isMicActive, isCameraActive },
        actions: { onChangeActiveStream, onGetNewStream },
    } = useContext(MediaContext);

    const {
        actions: { onGetCanvasStream },
        data: { isModelReady },
    } = useContext(VideoEffectsContext);

    const prevSharingUserId = usePrevious<number | undefined>(meeting.sharingUserId);

    const handleToggleAudio = useCallback(() => {
        updateLocalUserEvent({
            micStatus: isLocalMicActive ? 'inactive' : 'active',
        });

        AgoraController.setTracksState({
            isCameraEnabled: isLocalCamActive,
            isMicEnabled: !isLocalMicActive,
        });
    }, [isLocalMicActive, isLocalCamActive]);

    const handleToggleVideo = useCallback(() => {
        updateLocalUserEvent({
            cameraStatus: isLocalCamActive ? 'inactive' : 'active',
        });
        AgoraController.setTracksState({
            isCameraEnabled: !isLocalCamActive,
            isMicEnabled: isLocalMicActive,
        });
    }, [isLocalCamActive, isLocalMicActive]);

    const handleToggleSharing = useCallback(() => {
        if (!meeting.sharingUserId) {
            AgoraController.startScreensharing();
        } else if (isOwner || isSharingScreenActive) {
            updateMeetingSocketEvent({ sharingUserId: null });
        }
    }, [isSharingScreenActive, meeting.sharingUserId, isOwner]);

    const handleStopScreenSharing = useCallback(async () => {
        const newStream = await onGetNewStream();

        if (newStream) {
            const transformedStream = await onGetCanvasStream(newStream);

            await AgoraController.stopScreensharing({ stream: transformedStream });

            AgoraController.setTracksState({
                isCameraEnabled: isLocalCamActive,
                isMicEnabled: isLocalMicActive,
            });
        }
    }, [onGetNewStream, isLocalCamActive, isLocalMicActive]);

    useEffect(() => {
        if (!meeting.sharingUserId && prevSharingUserId === localUser.meetingUserId) {
            handleStopScreenSharing();
        }
    }, [prevSharingUserId, meeting.sharingUserId, handleStopScreenSharing]);

    useEffect(() => {
        (async () => {
            if (localUser.accessStatus === MeetingAccessStatuses.InMeeting && isModelReady) {
                const activeStream = onChangeActiveStream();

                if (activeStream) {
                    const transformedStream = await onGetCanvasStream(activeStream);

                    AgoraController.setUpController({
                        channel: meeting.id,
                        uid: localUser.meetingUserId,
                        onUserPublished: setMeetingUserMediaEvent,
                        onUserJoined: setMeetingUserMediaEvent,
                        onLocalTracks: setLocalUserMediaEvent,
                        onSharingStarted: updateMeetingSocketEvent,
                        onSharingStopped: updateMeetingSocketEvent,
                        onUserUnPublished: emptyFunction,
                        userLeft: emptyFunction,
                    });

                    if (transformedStream) {
                        await AgoraController.initiateConnection({ stream: transformedStream });
                    }

                    AgoraController.setTracksState({
                        isCameraEnabled: isCameraActive,
                        isMicEnabled: isMicActive,
                    });
                }
            }
        })();
    }, [localUser.accessStatus, isModelReady]);

    useEffect(
        () => {
            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.copyMeetingLinkDialog,
            });

            return () => {
                AgoraController.leave();
            }
        },
        [],
    );

    const handleUpdateMeetingTemplate = useCallback(async updateData => {
        if (updateData) {
            await updateMeetingTemplateFxWithData(updateData);
            updateUserSocketEvent({ username: updateData.data.fullName });
            updateLocalUserEvent({ username: updateData.data.fullName });
        }
    }, []);

    const isAbleToToggleSharing = isOwner || isSharingScreenActive || !meeting.sharingUserId;
    const isScreenSharing = Boolean(meeting.sharingUserId);

    return (
        <CustomGrid className={styles.mainMeetingWrapper}>
            <MeetingBackgroundVideo isScreenSharing={isScreenSharing} src={meetingTemplate.url}>
                <Image
                    className={styles.image}
                    src={meetingTemplate.previewUrl}
                    layout="fill"
                    objectFit="cover"
                />
                {isScreenSharing && <ScreenSharingLayout />}
                <MeetingUsersVideos />
            </MeetingBackgroundVideo>

            {Boolean(meetingTemplate?.id) && (
                <MeetingSettingsPanel
                    template={meetingTemplate}
                    onTemplateUpdate={handleUpdateMeetingTemplate}
                >
                    <MeetingControlPanel />
                    <CustomGrid container gap={1.5} className={styles.devicesWrapper}>
                        <AudioDeviceSetUpButton
                            isMicActive={isLocalMicActive}
                            onClick={handleToggleAudio}
                        />
                        <VideoDeviceSetUpButton
                            isCamActive={isLocalCamActive}
                            onClick={handleToggleVideo}
                        />
                        <ScreenSharingButton
                            isSharingActive={Boolean(meeting.sharingUserId)}
                            onAction={isAbleToToggleSharing ? handleToggleSharing : undefined}
                        />
                        <BackgroundAudioControl />
                    </CustomGrid>
                    <MeetingEndControls />
                    <MeetingGeneralInfo />
                    <MeetingNotes />
                </MeetingSettingsPanel>
            )}

            <DevicesSettingsDialog />
            <EndMeetingDialog />
            <InviteAttendeeDialog />
            <UserToKickDialog />
            <MeetingSounds />
            {isOwner && <CopyMeetingLinkDialog />}
        </CustomGrid>
    );
});

export { MeetingView };
