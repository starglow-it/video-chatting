import React, { memo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useStore } from 'effector-react';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomDivider } from 'shared-frontend/library/custom/CustomDivider';
import { EmailIcon } from 'shared-frontend/icons/OtherIcons/EmailIcon';
import { CopyLinkIcon } from 'shared-frontend/icons/OtherIcons/CopyLinkIcon';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// components
import { ActionButton } from 'shared-frontend/library/common/ActionButton';

// stores
import { appDialogsApi, addNotificationEvent } from '../../../store';
import { $localUserStore } from '../../../store/roomStores';

// types
import { AppDialogsEnum, NotificationType } from '../../../store/types';

// utils
import { getClientMeetingUrlWithDomain } from '../../../utils/urls';

// styles
import styles from './MeetingInviteParticipants.module.scss';

const Component = ({ onAction }: { onAction?: () => void }) => {
    const router = useRouter();

    const localUser = useStore($localUserStore);

    const handleOpenEmailInvite = useCallback(() => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.inviteAttendeeByEmailDialog,
        });
        onAction?.();
    }, []);

    const handleLinkCopied = useCallback(() => {
        addNotificationEvent({
            type: NotificationType.LinkInfoCopied,
            message: 'meeting.copy.link',
        });
        onAction?.();
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
                <ConditionalRender condition={!localUser.isGenerated}>
                    <CustomTooltip nameSpace="meeting" translation="invite.sendInvite">
                        <ActionButton
                            onAction={handleOpenEmailInvite}
                            className={styles.button}
                            Icon={<EmailIcon width="24px" height="24px" />}
                        />
                    </CustomTooltip>
                </ConditionalRender>
            </CustomGrid>
        </>
    );
};

export const MeetingInviteParticipants = memo(Component);
