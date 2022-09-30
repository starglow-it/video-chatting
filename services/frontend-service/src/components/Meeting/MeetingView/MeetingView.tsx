import React, { memo, useCallback, useEffect, useRef } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import Image from 'next/image';
import clsx from 'clsx';

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

// styles
import styles from './MeetingView.module.scss';

// stores
import { addNotificationEvent, appDialogsApi, checkIsPortraitLayoutEvent } from '../../../store';
import {
    $isOwner,
    $isScreenSharingStore,
    $localUserStore,
    $meetingConnectedStore,
    $meetingStore,
    $meetingTemplateStore,
    $meetingUsersStore,
    $serverTypeStore,
    initVideoChatEvent,
    setMeetingConnectedEvent,
    updateLocalUserEvent,
    updateMeetingTemplateFxWithData,
    updateUserSocketEvent,
} from '../../../store/roomStores';

// types
import { AppDialogsEnum, MeetingAccessStatuses, NotificationType } from '../../../store/types';

// helpers
import { isMobile } from '../../../utils/browser/detectBrowser';

const Component = () => {
    const meeting = useStore($meetingStore);
    const isScreenSharing = useStore($isScreenSharingStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const localUser = useStore($localUserStore);
    const isOwner = useStore($isOwner);
    const isMeetingConnected = useStore($meetingConnectedStore);
    const serverType = useStore($serverTypeStore);

    const hostUser = useStoreMap({
        store: $meetingUsersStore,
        keys: [meeting.hostUserId],
        fn: (state, [hostUserId]) => state.find(user => user.id === hostUserId) || null,
    });

    const prevHostUserId = useRef<string>(meeting.hostUserId);

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
                localUser.id &&
                !isMeetingConnected
            ) {
                initVideoChatEvent({ serverType });
                setMeetingConnectedEvent(true);
            }
        })();
    }, [localUser.accessStatus, meeting.id, localUser.id, isMeetingConnected, serverType]);

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

const MeetingView = memo(Component);

export default MeetingView;
