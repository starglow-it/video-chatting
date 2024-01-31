import { memo, useCallback, useState, useEffect, useRef } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import dynamic from "next/dynamic";
const MeetingJoyride = dynamic(() => import("react-joyride"), { ssr: false });

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
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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
import { ConfirmBecomeAudienceDialog } from '@components/Dialogs/ConfirmBecomeAudienceDialog/ConfirmBecomeAudienceDialog';
import { DownloadIcsEventDialog } from '@components/Dialogs/DownloadIcsEventDialog/DownloadIcsEventDialog';
import { isMobile as isMobileShared } from 'shared-utils';
import { getPreviewImage } from 'src/utils/functions/getPreviewImage';
import styles from './MeetingView.module.scss';

// stores
import {
    $windowSizeStore,
    $joyrideStore,
    emitMeetingJoyrideEvent,
    addNotificationEvent,
    appDialogsApi,
    checkIsPortraitLayoutEvent,
} from '../../../store';
import {
    $audioErrorStore,
    $isOwner,
    $isOwnerInMeeting,
    $isScreenSharingStore,
    $localUserStore,
    $meetingConnectedStore,
    $meetingStore,
    $meetingTemplateStore,
    $meetingUsersStore,
    $serverTypeStore,
    $videoErrorStore,
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
// import { MeetingManageAudio } from '../MeetingManageAudio/MeetingManageAudio';
import { MeetingBottomBarMobile } from '../MeetingBottomBarMobile/MeetingBottomBarMobile';
import { MeetingCarousel } from '../MeetingCarousel/MeetingCarousel';
import { MeetingHeader } from '../MeetingHeader/MeetingHeader';
import { MeetingLinksDrawer } from '../MeetingLinksDrawer/MeetingLinksDrawer';
import { HostDeviceRequrieDialog } from '@components/Dialogs/HostDeviceRequrieDialog/HostDeviceRequrieDialog';
import { UserToAudienceDialog } from '@components/Dialogs/UserToAudienceDialog/UserToAudienceDialog';
import { RecordVideoDownloadDialog } from '@components/Dialogs/RecordVideoDownloadDialog/RecordVideoDownloadDialog';
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
    const videoError = useStore($videoErrorStore);
    const audioError = useStore($audioErrorStore);
    const isAudioError = Boolean(audioError);
    const isVideoError = Boolean(videoError);
    const { runMeetingJoyride } = useStore($joyrideStore);
    const [stepIndex, setStepIndex] = useState(0);

    const hostUser = useStoreMap({
        store: $meetingUsersStore,
        keys: [meeting.hostUserId],
        fn: (state, [hostUserId]) =>
            state.find(user => user.id === hostUserId) || null,
    });

    const prevHostUserId = useRef<string>(meeting.hostUserId);

    const createContentWithLineBreaks = text => {
        return text.split('\n').map((line, index, array) => (
            <span key={index}>
                {line}
                {index !== array.length - 1 && <br />}
            </span>
        ));
    };

    const joyrideStyleOptions = {
        arrowColor: "#FF884E",
        backgroundColor: "#9243B7",
        textColor: "#fff",
        fontSize: "20px",
        width: "fit-content",
        zIndex: 9999,
        primaryColor: "#FF884E",

    };

    const joyrideSteps = [
        {
            target: "#inviteGuests",
            title: "invite guests",
            content: createContentWithLineBreaks("invite participants and attendees to your ruume via link or email."),
            placement: "right",
            disableBeacon: true
        },
        {
            target: "#privatePublicSetting",
            title: "private/public setting",
            content: (
                <>
                    set your ruume to private or public. <br /><br />
                    <b>Private ruumes </b> all attendees are participants and need your <br />
                    permission to join. <br /><br />
                    <b>Public ruumes </b> allows audience members to join and watch <br />
                    without permissions, chat, and ask questions.  <br />
                </>
            ),
            placement: "bottom",
            disableBeacon: true

        },
        {
            target: "#selectGuests",
            title: "select your guests",
            content: createContentWithLineBreaks("once you've determined if your ruume is private or public,\n select the audience you would like to invite then click the\n 'link' icon.\n\n participants and audience members have their own link."),
            placement: "left",
            disableBeacon: true
        },
        {
            target: "#menuBar",
            title: "menu bar",
            content: createContentWithLineBreaks("enjoy engaging functionality for you to customize and \n interact with participants in your ruume.\n\n post sticky notes, record your ruume, start transcripts and \n more. take a moment to hover over each icon to understand \n your new menu bar."),
            placement: "top",
            disableBeacon: true
        },
        {
            target: "#changeBackground",
            title: "set the scene",
            content: createContentWithLineBreaks("change backgrounds with a selection of presets o r from your \n own collection.\n\n with a business subscription, you can embed youtube \n videos directly into your ruume, audio included."),
            placement: "left",
            disableBeacon: true
        },
    ];

    useEffect(() => {
        if (isOwner && !isMobile && isAudioError) {
            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.hostDeviceRequireDialog,
            });
        } else {
            if (isOwner && !isMobile) {
                appDialogsApi.openDialog({
                    dialogKey: AppDialogsEnum.inviteGuestsDialog,
                });
            }
        }
    }, [isOwner, isMobile, isAudioError, isVideoError]);

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

    const handleJoyrideCallback = (data) => {
        const { action, index, type } = data;
        const joyrideEl = document.querySelector(".react-joyride__overlay");

        if (joyrideEl) {
            if (index <= joyrideSteps.length - 1) {
                joyrideEl.addEventListener("click", () => setStepIndex(index + 1));
            } else {
                emitMeetingJoyrideEvent({ runMeetingJoyride: false });
            }
        }

        if (type === 'step:after') {
            setStepIndex(index + 1);
        }

        if (type === 'tour:end' || action === 'close') {
            emitMeetingJoyrideEvent({ runMeetingJoyride: false });

            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.inviteGuestsDialogCountTimeStart
            });
        }
    };

    const previewImage = getPreviewImage(meetingTemplate);

    return (
        <CustomGrid className={styles.mainMeetingWrapper}>
            <MeetingJoyride
                callback={handleJoyrideCallback}
                steps={joyrideSteps}
                stepIndex={stepIndex}
                run={runMeetingJoyride}
                continuous={true}
                disableOverlayClose={true}
                styles={{
                    tooltip: {
                        borderRadius: 20,
                        padding: "20px"
                    },
                    tooltipTitle: {
                        marginLeft: "10px",
                        fontSize: "20px",
                        textAlign: "left"
                    },
                    tooltipContent: {
                        fontSize: "20px",
                        textAlign: "left"
                    },
                    tooltipFooter: {
                        justifyContent: "flex-start",
                        paddingLeft: "10px"
                    },
                    tooltipFooterSpacer: {
                        display: "none"
                    },
                    buttonNext: {
                        marginLeft: 'auto',
                        marginRight: 10
                    },
                    options: { ...joyrideStyleOptions }
                }}
                hideBackButton
                locale={{ next: <ArrowForwardIosIcon fontSize="small" />, last: "finish" }}
            />
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
                        {/* <MeetingManageAudio /> */}
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
            <UserToAudienceDialog />
            <MeetingSounds />
            {isOwner && <CopyMeetingLinkDialog />}
            <ScheduleMeetingDialog />
            <HostDeviceRequrieDialog />
            <InviteGuestsDialog />
            <ConfirmBecomeParticipantDialog />
            <ConfirmBecomeAudienceDialog />
            <DownloadIcsEventDialog />
            <RecordVideoDownloadDialog />
        </CustomGrid>
    );
};

export const MeetingView = memo(Component);
