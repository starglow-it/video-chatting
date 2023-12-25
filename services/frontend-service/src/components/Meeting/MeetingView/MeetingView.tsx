import { memo, useCallback, useEffect, useRef } from 'react';
import { useStore, useStoreMap } from 'effector-react';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

// common
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

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

// shared
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

// styles
import { MeetingAccessStatusEnum } from 'shared-types';
import { LeaveNoteForm } from '@components/LeaveNoteForm/LeaveNoteForm';
import { ScheduleMeetingDialog } from '@components/Dialogs/ScheduleMeetingDialog/ScheduleMeetingDialog';
import {
    StorageKeysEnum,
    WebStorage,
} from 'src/controllers/WebStorageController';
import { useBrowserDetect } from '@hooks/useBrowserDetect';
import { InviteGuestsDialog } from '@components/Dialogs/InviteGuestsDialog/InviteGuestsDialog';
import { ConfirmBecomeParticipantDialog } from '@components/Dialogs/ConfirmBecomeParticipantDialog/ConfirmBecomeParticipantDialog';
import { DownloadIcsEventDialog } from '@components/Dialogs/DownloadIcsEventDialog/DownloadIcsEventDialog';
import { isMobile as isMobileShared } from 'shared-utils';
import { getPreviewImage } from 'src/utils/functions/getPreviewImage';
import styles from './MeetingView.module.scss';

// stores
import {
    $windowSizeStore,
    addNotificationEvent,
    appDialogsApi,
    checkIsPortraitLayoutEvent,
} from '../../../store';
import {
    $isOwner,
    $isOwnerInMeeting,
    $isScreenSharingStore,
    $localUserStore,
    $meetingConnectedStore,
    $meetingStore,
    $meetingTemplateStore,
    $meetingUsersStore,
    $serverTypeStore,
    getCategoriesMediasFx,
    initVideoChatEvent,
    joinMeetingFx,
    setMeetingConnectedEvent,
    updateLocalUserEvent,
    updateMeetingTemplateFxWithData,
    updateUserSocketEvent,
} from '../../../store/roomStores';

// types
import { AppDialogsEnum, NotificationType } from '../../../store/types';
import { MeetingChangeBackground } from '../MeetingChangeBackground/MeetingChangeBackground';
import { MeetingManageAudio } from '../MeetingManageAudio/MeetingManageAudio';
import { MeetingBottomBarMobile } from '../MeetingBottomBarMobile/MeetingBottomBarMobile';
import { MeetingCarousel } from '../MeetingCarousel/MeetingCarousel';
import { MeetingHeader } from '../MeetingHeader/MeetingHeader';
import { MeetingLinksDrawer } from '../MeetingLinksDrawer/MeetingLinksDrawer';
// helpers

const Component = () => {
    const meeting = useStore($meetingStore);
    const isScreenSharingActive = useStore($isScreenSharingStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const localUser = useStore($localUserStore);
    const isOwner = useStore($isOwner);
    const isMeetingConnected = useStore($meetingConnectedStore);
    const serverType = useStore($serverTypeStore);
    const isJoinMeetingPending = useStore(joinMeetingFx.pending);
    const isOwnerInMeeting = useStore($isOwnerInMeeting);
    const { isMobile } = useBrowserDetect();
    const { width, height } = useStore($windowSizeStore);

    const hostUser = useStoreMap({
        store: $meetingUsersStore,
        keys: [meeting.hostUserId],
        fn: (state, [hostUserId]) =>
            state.find(user => user.id === hostUserId) || null,
    });

    const prevHostUserId = useRef<string>(meeting.hostUserId);

    useEffect(() => {
        if (isOwner && !isMobile) {
            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.inviteGuestsDialog,
            });
        }
    }, [isOwner, isMobile]);

    useEffect(() => {
        if (!isOwnerInMeeting && isMeetingConnected) {
            addNotificationEvent({
                type: NotificationType.HostChanged,
                message: 'Host has left the room.',
            });
        }
    }, [isOwnerInMeeting]);

    useEffect(() => {
        if (
            hostUser &&
            prevHostUserId.current !== hostUser?.id &&
            hostUser?.accessStatus === MeetingAccessStatusEnum.InMeeting
        ) {
            prevHostUserId.current = hostUser.id;

            addNotificationEvent({
                type: NotificationType.HostChanged,
                message:
                    localUser.id === hostUser?.id
                        ? 'You are host now'
                        : `${hostUser.username} is host now`,
            });
        }
    }, [
        hostUser?.id,
        hostUser?.username,
        localUser?.id,
        hostUser?.accessStatus,
    ]);

    useEffect(() => {
        (async () => {
            if (
                localUser.accessStatus === MeetingAccessStatusEnum.InMeeting &&
                meeting.id &&
                localUser.id &&
                !isMeetingConnected &&
                !isJoinMeetingPending
            ) {
                initVideoChatEvent({ serverType });
                setMeetingConnectedEvent(true);
                if (isOwner) {
                    updateMeetingTemplateFxWithData({
                        isPublishAudience: meetingTemplate.isPublishAudience,
                    });
                }
            }
        })();
    }, [
        localUser.accessStatus,
        meeting.id,
        localUser.id,
        isMeetingConnected,
        serverType,
        isJoinMeetingPending,
    ]);

    useEffect(() => {
        getCategoriesMediasFx({ userTemplateId: meetingTemplate.id });
        WebStorage.save({
            key: StorageKeysEnum.bgLastCall,
            data: {
                templateUrl: meetingTemplate.mediaLink
                    ? meetingTemplate.mediaLink.thumb
                    : meetingTemplate.url,
                templateType: meetingTemplate.mediaLink
                    ? 'image'
                    : meetingTemplate.templateType,
            },
        });
    }, []);

    useEffect(() => {
        if (isMobile) {
            checkIsPortraitLayoutEvent();
        }
    }, [isMobile]);

    const handleUpdateMeetingTemplate = useCallback(async (updateData: any) => {
        if (updateData) {
            await updateMeetingTemplateFxWithData(updateData.data);
            updateLocalUserEvent({ username: updateData.data.fullName });
            await updateUserSocketEvent({ username: updateData.data.fullName });
        }
    }, []);

    const previewImage = getPreviewImage(meetingTemplate);

    return (
        <CustomGrid className={styles.mainMeetingWrapper}>
            <MeetingBackgroundVideo
                templateType={meetingTemplate.templateType}
                src={meetingTemplate.url}
                mediaLink={meetingTemplate.mediaLink}
            >
                <CustomBox className={styles.imageWrapper}>
                    <ConditionalRender condition={!!previewImage}>
                        <CustomImage
                            className={styles.image}
                            src={previewImage}
                            width={isMobile ? `${width}px` : '100%'}
                            height={isMobile ? `${height}px` : '100%'}
                            layout="fill"
                            objectFit="cover"
                        />
                    </ConditionalRender>
                </CustomBox>
                <ConditionalRender condition={isScreenSharingActive}>
                    <ScreenSharingLayout />
                </ConditionalRender>
            </MeetingBackgroundVideo>

            {Boolean(meetingTemplate?.id) && !isMobileShared() && (
                <MeetingSettingsPanel
                    template={meetingTemplate}
                    onTemplateUpdate={handleUpdateMeetingTemplate}
                >
                    <ConditionalRender
                        condition={
                            Boolean(meetingTemplate?.links?.length) &&
                            !isScreenSharingActive
                        }
                    >
                        <MeetingGoodsLinks />
                    </ConditionalRender>
                    <MeetingControlPanel />
                    <MeetingControlButtons />
                    <MeetingGeneralInfo />
                    <MeetingNotes />
                    <MeetingUsersVideos />
                    <ConditionalRender condition={isOwner}>
                        <MeetingChangeBackground />
                    </ConditionalRender>
                    <ConditionalRender condition={!isMobile}>
                        <MeetingManageAudio />
                    </ConditionalRender>

                    <LeaveNoteForm />
                </MeetingSettingsPanel>
            )}
            {Boolean(meetingTemplate?.id) && isMobileShared() && (
                <MeetingSettingsPanel
                    template={meetingTemplate}
                    onTemplateUpdate={handleUpdateMeetingTemplate}
                >
                    <CustomGrid
                        width="100%"
                        height="100%"
                        display="flex"
                        flexDirection="column"
                    >
                        <MeetingHeader />
                        <MeetingCarousel />
                        <MeetingBottomBarMobile />
                        <MeetingControlPanel />
                        <MeetingLinksDrawer />
                    </CustomGrid>
                </MeetingSettingsPanel>
            )}

            <DevicesSettingsDialog />
            <EndMeetingDialog />
            <InviteAttendeeDialog />
            <UserToKickDialog />
            <MeetingSounds />
            {isOwner && <CopyMeetingLinkDialog />}
            <ScheduleMeetingDialog />
            <InviteGuestsDialog />
            <ConfirmBecomeParticipantDialog />
            <DownloadIcsEventDialog />
        </CustomGrid>
    );
};

export const MeetingView = memo(Component);
