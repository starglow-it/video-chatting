import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';

import { useStore } from 'effector-react';
import {
    $appDialogsStore,
    addNotificationEvent,
    appDialogsApi,
} from 'src/store';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { RoundCloseIcon } from 'shared-frontend/icons/RoundIcons/RoundCloseIcon';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppDialogsEnum, NotificationType } from 'src/store/types';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getClientMeetingUrlWithDomain } from 'src/utils/urls';
import { useRouter } from 'next/router';
import { useTimer } from '@hooks/useTimer';
import { isMobile } from 'shared-utils';
import { MeetingRoleGroup } from '@components/Meeting/MeetingRoleGroup/MeetingRoleGroup';
import { MeetingRole } from 'shared-types';
import { $meetingStore } from 'src/store/roomStores';
import { MeetingSwitchPrivate } from '@components/Meeting/MeetingSwitchPrivate/MeetingSwitchPrivate';
import styles from './InviteGuestsDIalog.module.scss';

export const InviteGuestsDialog = () => {
    const router = useRouter();
    const { inviteGuestsDialog } = useStore($appDialogsStore);
    const { isBlockAudiences } = useStore($meetingStore);

    const [link, setLink] = useState<string>(
        getClientMeetingUrlWithDomain(router.query.token as string),
    );

    const refRoleGroup = useRef<any>(null);

    const {
        value: currentTime,
        onStartTimer: handleStartCountDown,
        onEndTimer: handleEndCountDown,
    } = useTimer(true);

    const close = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.inviteGuestsDialog,
        });
    }, []);

    useEffect(() => {
        handleStartCountDown(0, 30000);
    }, []);

    useEffect(() => {
        if (currentTime === 30000) {
            handleEndCountDown();
            close();
        }
    }, [currentTime]);

    const handleLinkCopied = useCallback(() => {
        addNotificationEvent({
            type: NotificationType.LinkInfoCopied,
            message: 'meeting.copy.link',
        });
    }, []);

    const linkToDefault = () => {
        const role = refRoleGroup.current?.getValue();
        window.open(
            `mailto:?view=cm&fs=1&subject=Meeting Link
            &body=${`Please Join me on Ruume`}%0A${getClientMeetingUrlWithDomain(
                router.query.token as string,
            )}${role === MeetingRole.Lurker ? '?role=lurker' : ''}`,
            '_blank',
        );
    };

    const linkToGmail = () => {
        const role = refRoleGroup.current?.getValue();
        window.open(
            `
        https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
            `Meeting Link`,
        )}&body=${`Please Join me on Ruume`}%0A${getClientMeetingUrlWithDomain(
                router.query.token as string,
            )}${role === MeetingRole.Lurker ? '?role=lurker' : ''}`,
            '_blank',
        );
    };

    const handleChangeRole = (role: MeetingRole) => {
        setLink(
            `${getClientMeetingUrlWithDomain(router.query.token as string)}${
                role === MeetingRole.Lurker ? '?role=lurker' : ''
            }`,
        );
    };

    return (
        <CustomDialog
            open={inviteGuestsDialog && !isMobile()}
            className={styles.content}
        >
            <CustomGrid className={styles.main}>
                <CustomGrid className={styles.buttonClose}>
                    <RoundCloseIcon
                        width="28px"
                        height="28px"
                        onClick={close}
                    />
                </CustomGrid>
                <CustomGrid className={styles.header}>
                    <span>Invite Guests to this room</span>
                </CustomGrid>
                <CustomGrid className={styles.actions} gap={2}>
                    <CopyToClipboard text={link} onCopy={handleLinkCopied}>
                        <CustomGrid className={styles.actionItem}>
                            <CustomImage
                                src="/images/copy-link.png"
                                width={40}
                                height={40}
                                className={styles.button}
                            />
                            <span>Link</span>
                        </CustomGrid>
                    </CopyToClipboard>
                    <CustomGrid
                        className={styles.actionItem}
                        onClick={linkToDefault}
                    >
                        <CustomImage
                            src="/images/default-gmail.jpg"
                            width={60}
                            height={60}
                            objectFit="cover"
                        />
                        <span>Default Email</span>
                    </CustomGrid>
                    <CustomGrid
                        className={styles.actionItem}
                        onClick={linkToGmail}
                    >
                        <CustomImage
                            src="/images/gmail.png"
                            width={52}
                            height={52}
                            objectFit="cover"
                        />
                        <span>Gmail</span>
                    </CustomGrid>
                </CustomGrid>
                <MeetingSwitchPrivate />
                <MeetingRoleGroup
                    className={styles.roleGroup}
                    ref={refRoleGroup}
                    onChangeValue={handleChangeRole}
                    isBlockAudience={isBlockAudiences}
                />
            </CustomGrid>
        </CustomDialog>
    );
};
