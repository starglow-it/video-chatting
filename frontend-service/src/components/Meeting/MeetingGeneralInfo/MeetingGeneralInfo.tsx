import React, {memo, useCallback, useEffect, useRef} from 'react';
import { useStore } from 'effector-react';
import { useFormContext, useWatch } from 'react-hook-form';
import clsx from 'clsx';
import Image from 'next/image';
import {Fade} from "@mui/material";

// hooks

// components
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

// icons
import {EditIcon} from "@library/icons/EditIcon";
import {InfoIcon} from "@library/icons/InfoIcon";

// custom
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import {CustomPopper} from "@library/custom/CustomPopper/CustomPopper";

// styles
import {RoundErrorIcon} from "@library/icons/RoundIcons/RoundErrorIcon";
import styles from './MeetingGeneralInfo.module.scss';

// store
import {$isOwner, $meetingStore, $meetingTemplateStore} from '../../../store';
import {
    toggleEditTemplateOpen, toggleMeetingInfoOpen
} from "../../../store";

// helpers
import {formatCountDown} from "../../../utils/time/formatCountdown";

// const
import {ONE_MINUTE} from "../../../const/time/common";
import {useCountDown} from "../../../hooks/useCountDown";
import {useToggle} from "../../../hooks/useToggle";

const MeetingGeneralInfo = memo(() => {
    const isOwner = useStore($isOwner);
    const meeting = useStore($meetingStore);
    const meetingTemplate = useStore($meetingTemplateStore);

    const wrapperRef = useRef(null);

    const {
        value: isMeetingActionNoteOpened,
        onSwitchOn: handleOpenMeetingActionNote,
        onSwitchOff: handleCloseMeetingActionNote,
    } = useToggle(false);

    const {
        value: isMeetingActionOpened,
        onToggleSwitch: handleToggleAvatarAction,
    } = useToggle(false);

    const { control } = useFormContext();

    const signBoard = useWatch({
        control,
        name: 'signBoard',
    });

    const targetSignBoard = isOwner ? signBoard : meetingTemplate.signBoard;

    const isThereSignBoard = targetSignBoard && targetSignBoard !== 'default';

    const companyName = useWatch({
        control,
        name: 'companyName',
    });

    const fullName = useWatch({
        control,
        name: 'fullName',
    });

    const { value: meetingEndsAt, onStartCountDown } = useCountDown((meeting.endsAt - Date.now()) / 1000);

    const isAbove10Minutes = meetingEndsAt * 1000 < 10 * ONE_MINUTE;

    useEffect(() => {
        onStartCountDown();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            handleOpenMeetingActionNote();
        }, 2000);
    }, []);

    const handleMeetingAction = useCallback(
        () => {
            if (isOwner) {
                toggleEditTemplateOpen();
            } else {
                toggleMeetingInfoOpen();
            }
    }, []);

    return (
        <CustomGrid
            container
            ref={wrapperRef}
            className={clsx(styles.profileInfo, { [styles.withBoard]: isThereSignBoard })}
        >
            {isThereSignBoard
                ? (
                    <Image src={`/images/boards/${targetSignBoard}.png`} width="360px" height="244px" />
                )
                : null
            }
            <CustomGrid
                gap={1}
                container
                className={styles.info}
                direction={isThereSignBoard ? 'column' : 'row'}
                justifyContent={isThereSignBoard ? 'center' : 'flex-start'}
                alignItems="center"
            >
                <CustomBox
                    onMouseEnter={handleToggleAvatarAction}
                    onMouseLeave={handleToggleAvatarAction}
                    className={styles.profileAvatar}
                >
                    <ProfileAvatar
                        src={meetingTemplate?.user?.profileAvatar?.url}
                        width="60px"
                        height="60px"
                        userName={isOwner ? fullName : meetingTemplate.fullName}
                    />
                    <Fade in={isMeetingActionOpened}>
                        <CustomGrid onClick={handleMeetingAction} className={styles.meetingActionWrapper} container justifyContent="center" alignItems="center">
                            {isOwner ? <EditIcon width="36px" height="36px" /> : <InfoIcon width="36px" height="36px" /> }
                        </CustomGrid>
                    </Fade>
                </CustomBox>

                <CustomGrid container direction="column" alignItems={isThereSignBoard ? "center" : "flex-start"} className={styles.companyName}>
                    <CustomTypography
                        color="colors.white.primary"
                        className={clsx(styles.companyNameTitle, {
                            [styles.withBoard]: isThereSignBoard,
                            [styles.withoutBoard]: !isThereSignBoard,
                        })}
                    >
                        {isOwner ? companyName : meetingTemplate.companyName}
                    </CustomTypography>
                    <CustomBox>
                        <CustomTypography
                            color={`colors.${isAbove10Minutes ? 'red': 'white'}.primary`}
                            variant="body3"
                        >
                            Ends in
                        </CustomTypography>
                        &nbsp;
                        <CustomTypography
                            color={`colors.${isAbove10Minutes ? 'red': 'white'}.primary`}
                            variant="body3bold"
                        >
                            {formatCountDown(meetingEndsAt * 1000)}
                        </CustomTypography>
                    </CustomBox>
                </CustomGrid>
            </CustomGrid>
            <CustomPopper
                id="meetingActionNote"
                open={isMeetingActionNoteOpened}
                placement={isThereSignBoard ? "bottom" : "bottom-start"}
                anchorEl={wrapperRef.current}
            >
                <CustomGrid container alignItems="center" gap={1} className={clsx(styles.meetingActionNote, {[styles.withBoard]: isThereSignBoard })}>
                    <CustomTypography nameSpace="meeting" variant="body2" color="colors.white.primary" translation={`meetingActions.${isOwner ? "editTemplate" : "meetingInfo"}`} />
                    <RoundErrorIcon className={styles.closeIcon} width="16px" height="16px" onClick={handleCloseMeetingActionNote} />
                </CustomGrid>
            </CustomPopper>
        </CustomGrid>
    );
});

export { MeetingGeneralInfo };
