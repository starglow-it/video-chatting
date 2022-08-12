import React, { memo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import { CustomDivider } from '@library/custom/CustomDivider/CustomDivider';

// components
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { EmailIcon } from '@library/icons/EmailIcon';
import { CopyLinkIcon } from '@library/icons/CopyLinkIcon';

// stores
import { appDialogsApi, addNotificationEvent } from '../../../store';

// types
import { AppDialogsEnum, NotificationType } from '../../../store/types';

// utils
import { getClientMeetingUrlWithDomain } from '../../../utils/urls';

// styles
import styles from './MeetingInviteParticipants.module.scss';

const MeetingInviteParticipants = memo(() => {
    const router = useRouter();

    const handleOpenEmailInvite = useCallback(() => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.inviteAttendeeByEmailDialog,
        });
    }, []);

    const handleLinkCopied = useCallback(() => {
        addNotificationEvent({
            type: NotificationType.LinkInfoCopied,
            message: 'meeting.copy.link',
        });
    }, []);

    return (
        <>
            <CustomDivider className={styles.divider} />
            <CustomGrid container className={styles.meetingInvitesWrapper} alignItems="center">
                <CustomTypography
                    color="common.white"
                    className={styles.title}
                    nameSpace="meeting"
                    translation="invite.title"
                />
                <CopyToClipboard
                    text={getClientMeetingUrlWithDomain(router.query.token)}
                    onCopy={handleLinkCopied}
                >
                    <CustomTooltip nameSpace="meeting" translation="invite.copyLink">
                        <ActionButton
                            className={styles.button}
                            Icon={<CopyLinkIcon width="24px" height="24px" />}
                        />
                    </CustomTooltip>
                </CopyToClipboard>
                <CustomTooltip nameSpace="meeting" translation="invite.sendInvite">
                    <ActionButton
                        onAction={handleOpenEmailInvite}
                        className={styles.button}
                        Icon={<EmailIcon width="24px" height="24px" />}
                    />
                </CustomTooltip>
            </CustomGrid>
        </>
    );
});

export { MeetingInviteParticipants };
