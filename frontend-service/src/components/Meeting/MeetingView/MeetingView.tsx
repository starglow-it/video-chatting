import React, { memo, useCallback, useContext, useEffect } from 'react';
import { useStore } from 'effector-react';
import Image from 'next/image';
import clsx from 'clsx';

// helpers
import { usePrevious } from 'src/hooks/usePrevious';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import {CustomBox} from "@library/custom/CustomBox/CustomBox";

// components
import { MeetingControlPanel } from '@components/Meeting/MeetingControlPanel/MeetingControlPanel';
import { MeetingUsersVideos } from '@components/Meeting/MeetingUsersVideos/MeetingUsersVideos';
import { MeetingGoodsLinks } from '@components/Meeting/MeetingGoodsLinks/MeetingGoodsLinks';
import { MeetingNotes } from '@components/Meeting/MeetingNotes/MeetingNotes';
import { MeetingSettingsPanel } from '@components/Meeting/MeetingSettingsPanel/MeetingSettingsPanel';
import { MeetingGeneralInfo } from '@components/Meeting/MeetingGeneralInfo/MeetingGeneralInfo';
import { MeetingBackgroundComponent } from '@components/Meeting/MeetingBackgroundComponent/MeetingBackgroundComponent';
import { MeetingSounds } from '@components/Meeting/MeetingSounds/MeetingSounds';
import { DevicesSettingsDialog } from '@components/Dialogs/DevicesSettingsDialog/DevicesSettingsDialog';
import { EndMeetingDialog } from '@components/Dialogs/EndMeetingDialog/EndMeetingDialog';
import { InviteAttendeeDialog } from '@components/Dialogs/InviteAttendeeDialog/InviteAttendeeDialog';
import { UserToKickDialog } from '@components/Dialogs/UserToKickDialog/UserToKickDialog';
import { GoodsLinksButton } from '@components/Meeting/GoodsLinksButton/GoodsLinksButton';
import { ScreenSharingButton } from '@components/Meeting/ScreenSharingButton/ScreenSharingButton';
import { ScreenSharingLayout } from '@components/Meeting/ScreenSharingLayout/ScreenSharingLayout';
import { CopyMeetingLinkDialog } from '@components/Dialogs/CopyMeetingLinkDialog/CopyMeetingLinkDialog';
import { BackgroundAudioControl } from '@components/Meeting/BackgroundAudioControl/BackgroundAudioControl';
import { HangUpIcon } from '@library/icons/HangUpIcon';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { emptyFunction } from '../../../utils/functions/emptyFunction';

// misc
import { AgoraController } from '../../../controllers/VideoChatController';

// context
import { MediaContext } from '../../../contexts/MediaContext';
import { VideoEffectsContext } from '../../../contexts/VideoEffectContext';

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
    appDialogsApi,
    setMeetingConnectedEvent,
} from '../../../store';

// types
import { AppDialogsEnum, MeetingAccessStatuses } from '../../../store/types';
import { useToggle } from '../../../hooks/useToggle';

const MeetingView = memo(() => {
    const meeting = useStore($meetingStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const localUser = useStore($localUserStore);
    const isOwner = useStore($isOwner);

    const { value: isNeedToShowGoods, onToggleSwitch: handleToggleAllGoods } = useToggle(false);

    const isLocalMicActive = localUser.micStatus === 'active';
    const isLocalCamActive = localUser.cameraStatus === 'active';

    const isSharingScreenActive = localUser.meetingUserId === meeting.sharingUserId;

    const {
        data: { isMicActive, isCameraActive },
        actions: { onChangeActiveStream, onGetNewStream },
    } = useContext(MediaContext);

    const {
        actions: { onGetCanvasStream },
    } = useContext(VideoEffectsContext);

    const prevSharingUserId = usePrevious<number | undefined>(meeting.sharingUserId);

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
            if (localUser.accessStatus === MeetingAccessStatuses.InMeeting && meeting.id && localUser.meetingUserId) {
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

                        setMeetingConnectedEvent(true);
                    }

                    AgoraController.setTracksState({
                        isCameraEnabled: isCameraActive,
                        isMicEnabled: isMicActive,
                    });
                }
            }
        })();
    }, [localUser.accessStatus, meeting.id, localUser.meetingUserId]);

    useEffect(() => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.copyMeetingLinkDialog,
        });

        return () => {
            AgoraController.leave();
        };
    }, []);

    const handleUpdateMeetingTemplate = useCallback(async updateData => {
        if (updateData) {
            await updateMeetingTemplateFxWithData(updateData.data);
            updateUserSocketEvent({ username: updateData.data.fullName });
            updateLocalUserEvent({ username: updateData.data.fullName });
        }
    }, []);

    const handleEndVideoChat = useCallback(() => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.endMeetingDialog,
        });
    }, []);

    const isAbleToToggleSharing = isOwner || isSharingScreenActive || !meeting.sharingUserId;
    const isScreenSharing = Boolean(meeting.sharingUserId);

    const previewImage = (meetingTemplate?.previewUrls || []).find(
        image => image.resolution === 1080,
    );

    return (
        <CustomGrid className={styles.mainMeetingWrapper}>
            <MeetingBackgroundComponent isNeedToRenderModel={meetingTemplate.templateId === 28}>
                <CustomBox className={styles.imageWrapper}>
                    {previewImage?.url
                        ? (
                            <Image
                                className={clsx(styles.image, {
                                    [styles.blured]: Boolean(meetingTemplate.url),
                                })}
                                src={previewImage.url}
                                width="100%"
                                height="100%"
                                layout="fill"
                                objectFit="cover"
                            />
                        )
                        : null
                    }
                </CustomBox>
                {isScreenSharing && <ScreenSharingLayout />}
            </MeetingBackgroundComponent>

            {Boolean(meetingTemplate?.id) && (
                <MeetingSettingsPanel
                    template={meetingTemplate}
                    onTemplateUpdate={handleUpdateMeetingTemplate}
                >
                    <MeetingUsersVideos />
                    {(meetingTemplate.templateId === 18 && !isScreenSharing)
                        ? (
                            <MeetingGoodsLinks show={isNeedToShowGoods} />
                        )
                        : null
                    }
                    <MeetingControlPanel />
                    <CustomGrid container gap={1.5} className={styles.devicesWrapper}>
                        {meetingTemplate?.links?.length ? (
                            <GoodsLinksButton
                                isActive={isNeedToShowGoods}
                                onClick={handleToggleAllGoods}
                            />
                        ) : null}
                        <ScreenSharingButton
                            isSharingActive={Boolean(meeting.sharingUserId)}
                            onAction={isAbleToToggleSharing ? handleToggleSharing : undefined}
                        />
                        {meetingTemplate.isAudioAvailable ? <BackgroundAudioControl/> : null}
                        <ActionButton
                            variant="danger"
                            onAction={handleEndVideoChat}
                            className={styles.hangUpButton}
                            Icon={<HangUpIcon width="32px" height="32px" />}
                        />
                    </CustomGrid>
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
