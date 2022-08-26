import React, { memo, useCallback, useContext, useEffect, useRef } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import Image from 'next/image';
import clsx from 'clsx';

// hooks
import { usePrevious } from 'src/hooks/usePrevious';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// common
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// components
import { MeetingControlPanel } from '@components/Meeting/MeetingControlPanel/MeetingControlPanel';
import { MeetingControlButtons } from '@components/Meeting/MeetingControlButtons/MeetingControlButtons';
import { MeetingUsersVideos } from '@components/Meeting/MeetingUsersVideos/MeetingUsersVideos';
import { MeetingGoodsLinks } from '@components/Meeting/MeetingGoodsLinks/MeetingGoodsLinks';
import { MeetingNotes } from '@components/Meeting/MeetingNotes/MeetingNotes';
import { MeetingSettingsPanel } from '@components/Meeting/MeetingSettingsPanel/MeetingSettingsPanel';
import { MeetingGeneralInfo } from '@components/Meeting/MeetingGeneralInfo/MeetingGeneralInfo';
import { MeetingSounds } from '@components/Meeting/MeetingSounds/MeetingSounds';
import { DevicesSettingsDialog } from '@components/Dialogs/DevicesSettingsDialog/DevicesSettingsDialog';
import { EndMeetingDialog } from '@components/Dialogs/EndMeetingDialog/EndMeetingDialog';
import { InviteAttendeeDialog } from '@components/Dialogs/InviteAttendeeDialog/InviteAttendeeDialog';
import { UserToKickDialog } from '@components/Dialogs/UserToKickDialog/UserToKickDialog';
import { ScreenSharingLayout } from '@components/Meeting/ScreenSharingLayout/ScreenSharingLayout';
import { CopyMeetingLinkDialog } from '@components/Dialogs/CopyMeetingLinkDialog/CopyMeetingLinkDialog';
import { MeetingBackgroundVideo } from '@components/Meeting/MeetingBackgroundVideo/MeetingBackgroundVideo';
import { MobilePortraitStub } from '@library/common/MobilePortraitStub/MobilePortraitStub';
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
    $meetingUsersStore,
    setLocalUserMediaEvent,
    setMeetingUserMediaEvent,
    updateLocalUserEvent,
    updateMeetingSocketEvent,
    updateMeetingTemplateFxWithData,
    updateUserSocketEvent,
    appDialogsApi,
    setMeetingConnectedEvent,
    addNotificationEvent,
    checkIsPortraitLayoutEvent,
    $isScreensharingStore,
} from '../../../store';

// types
import { AppDialogsEnum, MeetingAccessStatuses, NotificationType } from '../../../store/types';
import { isMobile } from '../../../utils/browser/detectBrowser';

const Component = () => {
    const meeting = useStore($meetingStore);
    const isScreenSharing = useStore($isScreensharingStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const localUser = useStore($localUserStore);
    const isOwner = useStore($isOwner);

    const hostUser = useStoreMap({
        store: $meetingUsersStore,
        keys: [meeting.hostUserId],
        fn: (state, [hostUserId]) => state.find(user => user.id === hostUserId) || null,
    });

    const isLocalMicActive = localUser.micStatus === 'active';
    const isLocalCamActive = localUser.cameraStatus === 'active';

    const prevHostUserId = useRef<string>('');

    const {
        data: { isMicActive, isCameraActive },
        actions: { onChangeActiveStream, onGetNewStream },
    } = useContext(MediaContext);

    const {
        actions: { onGetCanvasStream },
    } = useContext(VideoEffectsContext);

    const prevSharingUserId = usePrevious<number | undefined>(meeting.sharingUserId);

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
        if (
            Boolean(localUser.meetingUserId) &&
            !meeting.sharingUserId &&
            prevSharingUserId === localUser.meetingUserId
        ) {
            handleStopScreenSharing();
        }
    }, [prevSharingUserId, meeting.sharingUserId, handleStopScreenSharing]);

    useEffect(() => {
        if (hostUser && prevHostUserId.current !== hostUser?.id) {
            prevHostUserId.current = hostUser.id;

            addNotificationEvent({
                type: NotificationType.HostChanged,
                message:
                    localUser.id === hostUser?.id
                        ? 'You are host now'
                        : `${hostUser.username} is host now`,
            });
        }
    }, [hostUser?.id, hostUser?.username, localUser?.id]);

    useEffect(() => {
        (async () => {
            if (
                localUser.accessStatus === MeetingAccessStatuses.InMeeting &&
                meeting.id &&
                localUser.meetingUserId
            ) {
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
        if (isMobile()) {
            checkIsPortraitLayoutEvent();
        } else {
            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.copyMeetingLinkDialog,
            });
        }

        return () => {
            AgoraController.leave();
        };
    }, []);

    const handleUpdateMeetingTemplate = useCallback(async updateData => {
        if (updateData) {
            await updateMeetingTemplateFxWithData(updateData.data);
            updateLocalUserEvent({ username: updateData.data.fullName });
            await updateUserSocketEvent({ username: updateData.data.fullName });
        }
    }, []);

    const previewImage = (meetingTemplate?.previewUrls || []).find(
        image => image.resolution === 1080,
    );

    return (
        <CustomGrid className={styles.mainMeetingWrapper}>
            <MeetingBackgroundVideo src={meetingTemplate.url}>
                <CustomBox className={styles.imageWrapper}>
                    <ConditionalRender condition={Boolean(previewImage?.url)}>
                        <Image
                            className={clsx(styles.image, {
                                [styles.blured]: Boolean(meetingTemplate.url),
                            })}
                            src={previewImage?.url || ''}
                            width="100%"
                            height="100%"
                            layout="fill"
                            objectFit="cover"
                        />
                    </ConditionalRender>
                </CustomBox>
                <ConditionalRender condition={isScreenSharing}>
                    <ScreenSharingLayout />
                </ConditionalRender>
            </MeetingBackgroundVideo>

            {Boolean(meetingTemplate?.id) && (
                <MeetingSettingsPanel
                    template={meetingTemplate}
                    onTemplateUpdate={handleUpdateMeetingTemplate}
                >
                    <MeetingUsersVideos />
                    <ConditionalRender
                        condition={meetingTemplate.templateId === 20 && !isScreenSharing}
                    >
                        <MeetingGoodsLinks />
                    </ConditionalRender>
                    <MeetingControlPanel />
                    <MeetingControlButtons />
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
            <MobilePortraitStub />
        </CustomGrid>
    );
};

export const MeetingView = memo(Component);
