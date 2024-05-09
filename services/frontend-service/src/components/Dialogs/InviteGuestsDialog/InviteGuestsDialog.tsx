import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import clsx from "clsx";

import { useStore } from 'effector-react';
import {
    $appDialogsStore,
    addNotificationEvent,
    appDialogsApi,
} from 'src/store';
import {
    emitMeetingJoyrideEvent
} from '../../../store';
import {
    $audioErrorStore,
} from '../../../store/roomStores';
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
import { $meetingTemplateStore } from 'src/store/roomStores';
import { MeetingSwitchPrivate } from '@components/Meeting/MeetingSwitchPrivate/MeetingSwitchPrivate';

import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { Translation } from '@library/common/Translation/Translation';

import styles from './InviteGuestsDIalog.module.scss';

export const InviteGuestsDialog = () => {
    const router = useRouter();
    const { inviteGuestsDialog, inviteGuestsDialogCountTimeStart } = useStore($appDialogsStore);
    const { isPublishAudience } = useStore($meetingTemplateStore);
    const { hostDeviceRequireDialog } = useStore($appDialogsStore);
    const audioError = useStore($audioErrorStore);
    const isAudioError = Boolean(audioError);

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
        if (inviteGuestsDialogCountTimeStart) {
            handleStartCountDown(0, 30000);
        }
    }, [inviteGuestsDialogCountTimeStart]);

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

    const [welcomeMeetingDialog, setWelcomeMeetingDialog] = useState(false);

    useEffect(() => {
        const isFirstMeeting = localStorage.getItem("isFirstMeeting");

        if (isFirstMeeting && !isAudioError) {
            setWelcomeMeetingDialog(true);
            localStorage.removeItem("isFirstMeeting");
        } else {
            if (welcomeMeetingDialog) {
                setWelcomeMeetingDialog(false);
            }
        }
    }, []);

    const handleCloseWelcomeMeetingDialog = useCallback(() => {
        setWelcomeMeetingDialog(false);

    }, []);

    const handleStartMeetingTour = async () => {
        setWelcomeMeetingDialog(false);

        await appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.inviteGuestsDialog,
        });

        await appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.inviteGuestsDialogCountTimeStart
        });

        await emitMeetingJoyrideEvent({ runMeetingJoyride: true });
    }

    const linkToDefault = () => {
        try {
            const role = refRoleGroup.current?.getValue();
            window.open(
                `mailto:?view=cm&fs=1&subject=Meeting Link
            &body=${`Please Join me on Ruume`}%0A${getClientMeetingUrlWithDomain(
                    router.query.token as string,
                )}${role === MeetingRole.Audience ? '?role=audience' : ''}`,
                '_blank',
            );
        } catch (error) {

        }
    };

    const linkToGmail = () => {
        try {
            const role = refRoleGroup.current?.getValue();
            window.open(
                `
        https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
                    `Meeting Link`,
                )}&body=${`Please Join me on Ruume`}%0A${getClientMeetingUrlWithDomain(
                    router.query.token as string,
                )}${role === MeetingRole.Audience ? '?role=audience' : ''}`,
                '_blank',
            );
        } catch (error) {

        }
    };

    const handleChangeRole = (role: MeetingRole) => {
        setLink(
            `${getClientMeetingUrlWithDomain(router.query.token as string)}${role === MeetingRole.Audience ? '?role=audience' : ''
            }`,
        );
    };

    return (
        <>
            <Paper
                className={clsx(styles.paper, { [styles.disableWelcomeMeeting]: !welcomeMeetingDialog || hostDeviceRequireDialog, [styles.mobilePaper]: isMobile() })}
            >
                <CustomGrid
                    container
                    direction="column"
                    alignItems="flex-start"
                    wrap="nowrap"
                    gap={2}
                >
                    <IconButton aria-label="close" size="small" disableFocusRipple={true} className={styles.closeBtn} onClick={handleCloseWelcomeMeetingDialog} >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant={isMobile() ? "h4" : "h2"} className={styles.welcomeCaption}>welcome to your first ruume! let's take a moment to explore.</Typography>
                    {!isMobile() &&
                        <CustomButton
                            label={
                                <Translation
                                    nameSpace="common"
                                    translation="buttons.next"
                                />
                            }
                            variant="text"
                            onClick={handleStartMeetingTour}
                            className={clsx(styles.actionBtn)}
                        />
                    }
                </CustomGrid>
            </Paper>
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
                        <span>invite guests to this ruume</span>
                    </CustomGrid>
                    <MeetingSwitchPrivate />
                    <MeetingRoleGroup
                        className={styles.roleGroup}
                        ref={refRoleGroup}
                        onChangeValue={handleChangeRole}
                        isBlockAudience={!isPublishAudience}
                    />
                    <CustomGrid id="inviteGuests" className={styles.actions} gap={2}>
                        <CopyToClipboard text={link} onCopy={handleLinkCopied}>
                            <CustomGrid className={styles.actionItem}>
                                <CustomImage
                                    src="/images/white-link.png"
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
                </CustomGrid>
            </CustomDialog>
        </>

    );
};
