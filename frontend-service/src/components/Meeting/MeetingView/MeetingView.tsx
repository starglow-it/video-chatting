import React, { memo, useCallback, useContext, useEffect } from 'react';
import { useStore } from 'effector-react';

// helpers

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// components
import { MeetingControlPanel } from '@components/Meeting/MeetingControlPanel/MeetingControlPanel';
import { MeetingUsersVideos } from '@components/Meeting/MeetingUsersVideos/MeetingUsersVideos';
import { MeetingEndControls } from '@components/Meeting/MeetingEndControls/MeetingEndControls';
import { MeetingNotes } from '@components/Meeting/MeetingNotes/MeetingNotes';
import { MeetingSettingsPanel } from '@components/Meeting/MeetingSettingsPanel/MeetingSettingsPanel';
import { MeetingGeneralInfo } from '@components/Meeting/MeetingGeneralInfo/MeetingGeneralInfo';
import { MeetingBackgroundVideo } from '@components/Meeting/MeetingBackgroundVideo/MeetingBackgroundVideo';
import { DevicesSettingsDialog } from '@components/Dialogs/DevicesSettingsDialog/DevicesSettingsDialog';
import { EndMeetingDialog } from '@components/Dialogs/EndMeetingDialog/EndMeetingDialog';
import { InviteAttendeeDialog } from '@components/Dialogs/InviteAttendeeDialog/InviteAttendeeDialog';
import { UserToKickDialog } from '@components/Dialogs/UserToKickDialog/UserToKickDialog';
import { AudioDeviceSetUpButton } from '@components/Media/DeviceSetUpButtons/AudioDeviceSetUpButton';
import { VideoDeviceSetUpButton } from '@components/Media/DeviceSetUpButtons/VideoDeviceSetUpButton';
import { ScreenSharingButton } from '@components/Meeting/ScreenSharingButton/ScreenSharingButton';
import { ScreenSharingLayout } from '@components/Meeting/ScreenSharingLayout/ScreenSharingLayout';
import { emptyFunction } from '../../../utils/functions/emptyFunction';
import { usePrevious } from '../../../hooks/usePrevious';
import { SettingsVideoEffectsProvider } from '../../../contexts/SettingsVideoEffectsContext';

// misc
import { AgoraController } from '../../../controllers/VideoChatController';

// context
import { MediaContext } from '../../../contexts/MediaContext';
import { VideoEffectsContext } from '../../../contexts/VideoEffectContext';

// styles
import styles from './MeetingView.module.scss';

// stores
import {
    $meetingStore,
    $meetingTemplateStore,
    emitUpdateMeetingTemplate,
    updateMeetingSocketEvent,
    updateMeetingTemplateFx,
} from '../../../store/meeting';
import {
    $localUserStore,
    emitUpdateUserEvent,
    setLocalUserMediaEvent,
    setMeetingUserMediaEvent,
    updateLocalUserStateEvent,
} from '../../../store/users';

// types
import { MeetingAccessStatuses } from '../../../store/types';

const MeetingView = memo(() => {
    const meeting = useStore($meetingStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const localUser = useStore($localUserStore);

    const isLocalMicActive = localUser.micStatus === 'active';
    const isLocalCamActive = localUser.cameraStatus === 'active';

    const isOwner = meeting.ownerProfileId === localUser.profileId;

    const isSharingScreenActive = localUser.meetingUserId === meeting.sharingUserId;

    const {
        data: { isMicActive, isCameraActive, activeStream },
        actions: { onChangeActiveStream },
    } = useContext(MediaContext);

    const {
        actions: { onGetCanvasStream },
        data: { isModelReady },
    } = useContext(VideoEffectsContext);

    const prevSharingUserId = usePrevious<number | undefined>(meeting.sharingUserId);

    const handleToggleAudio = useCallback(() => {
        updateLocalUserStateEvent({
            micStatus: isLocalMicActive ? 'inactive' : 'active',
        });

        AgoraController.setTracksState({
            isCameraEnabled: isLocalCamActive,
            isMicEnabled: !isLocalMicActive,
        });
    }, [isLocalMicActive, isLocalCamActive]);

    const handleToggleVideo = useCallback(() => {
        updateLocalUserStateEvent({
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
        if (activeStream) {
            const transformedStream = await onGetCanvasStream(activeStream);

            AgoraController.stopScreensharing({ stream: transformedStream });
        }
    }, [activeStream]);

    useEffect(() => {
        if (!meeting.sharingUserId && prevSharingUserId === localUser.meetingUserId) {
            handleStopScreenSharing();
        }
    }, [prevSharingUserId, meeting.sharingUserId]);

    useEffect(() => {
        (async () => {
            if (localUser.accessStatus === MeetingAccessStatuses.InMeeting && isModelReady) {
                const activeStream = onChangeActiveStream();

                const transformedStream = await onGetCanvasStream(activeStream);

                AgoraController.setUpController({
                    channel: meeting.id,
                    uid: localUser.meetingUserId!,
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
        })();
    }, [localUser.accessStatus, isModelReady]);

    useEffect(
        () => () => {
            AgoraController.leave();
        },
        [],
    );

    const handleUpdateMeetingTemplate = useCallback(async updateData => {
        if (updateData) {
            await updateMeetingTemplateFx(updateData);
            emitUpdateMeetingTemplate();
            emitUpdateUserEvent({ username: updateData.data.fullName });
            updateLocalUserStateEvent({ username: updateData.data.fullName });
        }
    }, []);

    const isAbleToToggleSharing = isOwner || isSharingScreenActive || !meeting.sharingUserId;

    return (
        <CustomGrid className={styles.mainMeetingWrapper}>
            <MeetingBackgroundVideo src="/videos/Lakeside-George.mp4" />

            {Boolean(meeting.sharingUserId) && <ScreenSharingLayout />}

            {Boolean(meetingTemplate?.id) && (
                <MeetingSettingsPanel
                    template={meetingTemplate}
                    onTemplateUpdate={handleUpdateMeetingTemplate}
                >
                    <MeetingUsersVideos />
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
                    </CustomGrid>
                    <MeetingEndControls />
                    <MeetingGeneralInfo />
                    <MeetingNotes />
                </MeetingSettingsPanel>
            )}
            <SettingsVideoEffectsProvider>
                <DevicesSettingsDialog />
            </SettingsVideoEffectsProvider>

            <EndMeetingDialog />
            <InviteAttendeeDialog />
            <UserToKickDialog />
        </CustomGrid>
    );
});

export { MeetingView };
