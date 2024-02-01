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
import { EmailIcon } from 'shared-frontend/icons/OtherIcons/EmailIcon';
import { CopyLinkIcon } from 'shared-frontend/icons/OtherIcons/CopyLinkIcon';
import { ScheduleIcon } from 'shared-frontend/icons/OtherIcons/ScheduleIcon';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

import Button from '@mui/material/Button';

// components
import { ActionButton } from 'shared-frontend/library/common/ActionButton';

// stores
import { appDialogsApi, setScheduleTemplateIdEvent } from '../../../store';
import {
    $localUserStore,
    $meetingTemplateStore,
    $meetingUsersStore,
} from '../../../store/roomStores';

// types
import { AppDialogsEnum } from '../../../store/types';
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
    isParticipantPanelShow:Boolean,
    onAction?: () => void, 
    handleParticipantPanel: (data: Boolean) => void
}) => {
    const router = useRouter();

    const localUser = useStore($localUserStore);
    const meetingTemplate = useStore($meetingTemplateStore);

    const participants = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state =>
            state.filter(
                user =>
                    user.accessStatus === MeetingAccessStatusEnum.InMeeting &&
                    user.meetingRole !== MeetingRole.Audience,
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

    const handleLinkCopied = useCallback(() => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.copyMeetingLinkDialog,
        });
        onAction?.();
    }, []);

    const handleOpenScheduling = () => {
        setScheduleTemplateIdEvent(meetingTemplate.id);
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.scheduleMeetingDialog,
        });
    };

    return (
        <>
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
                            [styles.activeBtn]: !isParticipantPanelShow
                        })}
                        onClick={() => handleParticipantPanel(false)}
                    >Audiences</Button>
                    <ConditionalRender condition={!localUser.isGenerated}>
                        <div className={styles.statistics}>
                            {audiences.length}
                        </div>
                    </ConditionalRender>
                </CustomGrid>
                <CustomGrid
                    container
                    className={clsx(styles.meetingInvitesWrapper, styles.attendeesStatistics)}
                    alignItems="center"
                >
                    <Button
                        variant="text"
                        className={clsx(styles.title, styles.attendeeBtn, {
                            [styles.activeBtn]: isParticipantPanelShow
                        })}
                        onClick={() => handleParticipantPanel(true)}
                    >Participants</Button>
                    <ConditionalRender condition={!localUser.isGenerated}>
                        <div className={styles.statistics}>
                            {participants.length}
                        </div>
                    </ConditionalRender>
                </CustomGrid>
                <CustomTypography
                    color="common.white"
                    className={styles.title}
                    nameSpace="meeting"
                    translation="invite.title"
                />
                <CopyToClipboard
                    text={getClientMeetingUrlWithDomain(
                        router.query.token as string,
                    )}
                    onCopy={handleLinkCopied}
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
                <ConditionalRender condition={!localUser.isGenerated}>
                    <CustomTooltip
                        nameSpace="meeting"
                        translation="invite.sendInvite"
                    >
                        <ActionButton
                            onAction={handleOpenEmailInvite}
                            className={styles.button}
                            Icon={<EmailIcon width="24px" height="24px" />}
                        />
                    </CustomTooltip>
                </ConditionalRender>
                <CustomGrid
                    container
                    className={styles.meetingInvitesWrapper}
                    alignItems="center"
                >
                    <CustomTypography
                        color="common.white"
                        className={styles.title}
                        nameSpace="meeting"
                        translation="schedule.title"
                    />
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
