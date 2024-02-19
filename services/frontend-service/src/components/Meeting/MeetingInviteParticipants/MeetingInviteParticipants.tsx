/* eslint-disable react/require-default-props */
import { memo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useStore, useStoreMap } from 'effector-react';
import clsx from 'clsx';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CopyLinkIcon } from 'shared-frontend/icons/OtherIcons/CopyLinkIcon';
import { PersonPlusIcon } from 'shared-frontend/icons/OtherIcons/PersonPlusIcon';
import { ScheduleIcon } from 'shared-frontend/icons/OtherIcons/ScheduleIcon';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

import Button from '@mui/material/Button';

// components
import { ActionButton } from 'shared-frontend/library/common/ActionButton';

// stores
import { addNotificationEvent, appDialogsApi, setScheduleTemplateIdEvent } from '../../../store';
import {
    $localUserStore,
    $meetingTemplateStore,
    $meetingUsersStore,
    $meetingStore,
} from '../../../store/roomStores';

// types
import { AppDialogsEnum, NotificationType } from '../../../store/types';
import { MeetingAccessStatusEnum, MeetingRole } from 'shared-types';

// utils
import { getClientMeetingUrlWithDomain } from '../../../utils/urls';

// styles
import styles from './MeetingInviteParticipants.module.scss';

const Component = ({
    isParticipantPanelShow,
    onAction,
    handleParticipantPanel
}: {
    isParticipantPanelShow: Boolean,
    onAction?: () => void,
    handleParticipantPanel: (data: Boolean) => void
}) => {
    const router = useRouter();

    const localUser = useStore($localUserStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const { isPublishAudience } = useStore($meetingTemplateStore)

    const participants = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state =>
            state.filter(
                user =>
                    user.accessStatus === MeetingAccessStatusEnum.InMeeting &&
                    user.meetingRole !== MeetingRole.Audience &&
                    user.meetingRole !== MeetingRole.Recorder,
            ),
    });

    const audiences = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state =>
            state.filter(
                user =>
                    user.accessStatus === MeetingAccessStatusEnum.InMeeting &&
                    user.meetingRole === MeetingRole.Audience,
            ),
    });

    const handleOpenEmailInvite = useCallback(() => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.inviteAttendeeByEmailDialog,
        });
        onAction?.();
    }, []);

    const handleParticipantLinkCopied = () => {
        addNotificationEvent({
            type: NotificationType.LinkInfoCopied,
            message: 'meeting.copy.link',
        });

    };

    const handleAudienceLinkCopied = () => {
        if (!isPublishAudience) {
            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.copyMeetingLinkDialog,
            });
            onAction?.();
        } else {
            addNotificationEvent({
                type: NotificationType.LinkInfoCopied,
                message: 'meeting.copy.link',
            });
        }
    };

    const handleOpenScheduling = () => {
        setScheduleTemplateIdEvent(meetingTemplate.id);
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.scheduleMeetingDialog,
        });
    };

    return (
        <>
            <CustomTypography color="common.white" className={styles.headerTitle}>
                Add Callers
                <PersonPlusIcon width="18px" height="18px" className={styles.icon} />
            </CustomTypography>
            <CustomGrid
                container
                alignItems="center"
            >
                <CustomGrid
                    container

                    alignItems="center"
                >
                    <Button
                        variant="text"
                        className={clsx(styles.title, styles.attendeeBtn, {
                            [styles.activeBtn]: isParticipantPanelShow
                        })}
                        onClick={() => handleParticipantPanel(true)}
                    >participants</Button>
                    <ConditionalRender condition={!localUser.isGenerated}>
                        <div className={styles.statistics}>
                            {participants.length}
                        </div>
                        <CopyToClipboard
                            text={getClientMeetingUrlWithDomain(
                                router.query.token as string,
                            )}
                            onCopy={handleParticipantLinkCopied}
                        >
                            <CustomTooltip
                                nameSpace="meeting"
                                translation="invite.copyLink"
                            >
                                <ActionButton
                                    className={styles.button}
                                    Icon={<CopyLinkIcon width="24px" height="24px" />}
                                />
                            </CustomTooltip>
                        </CopyToClipboard>

                    </ConditionalRender>
                </CustomGrid>

                <CustomGrid
                    container
                    alignItems="center"
                    className={clsx(styles.meetingInvitesWrapper, styles.attendeesStatistics)}
                >
                    <Button
                        variant="text"
                        className={clsx(styles.title, styles.attendeeBtn, {
                            [styles.activeBtn]: !isParticipantPanelShow
                        })}
                        onClick={() => handleParticipantPanel(false)}
                    >audiences</Button>
                    <ConditionalRender condition={!localUser.isGenerated}>
                        <div className={styles.statistics}>
                            {audiences.length}
                        </div>

                    </ConditionalRender>
                    <CopyToClipboard
                        text={getClientMeetingUrlWithDomain(
                            router.query.token as string,
                        ) + '?role=audience'}
                        onCopy={handleAudienceLinkCopied}
                    >
                        <CustomTooltip
                            nameSpace="meeting"
                            translation="invite.copyLink"
                        >
                            <ActionButton
                                className={clsx(styles.button, { [styles.disabled]: !isPublishAudience })}
                                Icon={<CopyLinkIcon width="24px" height="24px" />}
                            />
                        </CustomTooltip>
                    </CopyToClipboard>

                </CustomGrid>

                <CustomGrid
                    container
                    alignItems="center"
                    className={clsx(styles.meetingInvitesWrapper, styles.attendeesStatistics, styles.schedule)}
                >
                    <CustomTypography
                        variant="text"
                        className={clsx(styles.title, styles.attendeeBtn)}
                    >schedule</CustomTypography>

                    <CustomTooltip
                        nameSpace="meeting"
                        translation="schedule.tooltip"
                    >
                        <ActionButton
                            onAction={handleOpenScheduling}
                            className={styles.button}
                            Icon={<ScheduleIcon width="24px" height="24px" />}
                        />
                    </CustomTooltip>
                </CustomGrid>
            </CustomGrid>
        </>
    );
};

export const MeetingInviteParticipants = memo(Component);
