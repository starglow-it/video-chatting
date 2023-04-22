import React, { memo, useCallback, useEffect, useRef } from 'react';
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
import { MobilePortraitStub } from '@components/MobilePortraitStub/MobilePortraitStub';

// shared
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

// styles
import { isMobile } from 'shared-utils';
import { MeetingAccessStatusEnum } from 'shared-types';
import styles from './MeetingView.module.scss';

// stores
import {
    addNotificationEvent,
    appDialogsApi,
    checkIsPortraitLayoutEvent,
} from '../../../store';
import {
    $isOwner,
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
import { LeaveNoteForm } from '@components/LeaveNoteForm/LeaveNoteForm';
import { MeetingMonetizationButton } from '../MeetingMonetization/MeetingMonetizationButton';

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

    const hostUser = useStoreMap({
        store: $meetingUsersStore,
        keys: [meeting.hostUserId],
        fn: (state, [hostUserId]) =>
            state.find(user => user.id === hostUserId) || null,
    });

    const prevHostUserId = useRef<string>(meeting.hostUserId);

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
            console.log([
                localUser.accessStatus,
                meeting.id,
                localUser.id,
                isMeetingConnected,
                serverType,
                isJoinMeetingPending,
            ]);
            if (
                localUser.accessStatus === MeetingAccessStatusEnum.InMeeting &&
                meeting.id &&
                localUser.id &&
                !isMeetingConnected &&
                !isJoinMeetingPending
            ) {
                initVideoChatEvent({ serverType });
                setMeetingConnectedEvent(true);
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
        getCategoriesMediasFx();
    }, []);

    useEffect(() => {
        if (isMobile()) {
            checkIsPortraitLayoutEvent();
        } else {
            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.copyMeetingLinkDialog,
            });
        }
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
            <MeetingBackgroundVideo
                templateType={meetingTemplate.templateType}
                src={meetingTemplate.url}
            >
                <CustomBox className={styles.imageWrapper}>
                    <ConditionalRender condition={Boolean(previewImage?.url)}>
                        <CustomImage
                            className={styles.image}
                            src={previewImage?.url || ''}
                            width="100%"
                            height="100%"
                            layout="fill"
                            objectFit="cover"
                        />
                    </ConditionalRender>
                </CustomBox>
                <ConditionalRender condition={isScreenSharingActive}>
                    <ScreenSharingLayout />
                </ConditionalRender>
            </MeetingBackgroundVideo>

            {Boolean(meetingTemplate?.id) && (
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
                    <MeetingMonetizationButton />
                    <LeaveNoteForm />
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
