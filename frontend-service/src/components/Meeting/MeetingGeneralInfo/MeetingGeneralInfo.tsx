import React, {memo, useEffect} from 'react';
import { useStore } from 'effector-react';
import { useFormContext, useWatch } from 'react-hook-form';
import clsx from 'clsx';
import Image from 'next/image';

// hooks
import {useCountDown} from "../../../hooks/useCountDown";

// components
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

// custom
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// styles
import styles from './MeetingGeneralInfo.module.scss';

// store
import {$isOwner, $meetingStore, $meetingTemplateStore} from '../../../store/meeting';

import {formatCountDown} from "../../../utils/time/formatCountdown";
import {ONE_MINUTE} from "../../../const/time/common";

const MeetingGeneralInfo = memo(() => {
    const isOwner = useStore($isOwner);
    const meeting = useStore($meetingStore);
    const meetingTemplate = useStore($meetingTemplateStore);

    const { control } = useFormContext();

    const signBoard = useWatch({
        control,
        name: 'signBoard',
    });

    const isThereSignBoard = signBoard && signBoard !== 'default';

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

    return (
        <CustomGrid
            container
            className={clsx(styles.profileInfo, { [styles.withBoard]: isThereSignBoard })}
        >
            {isThereSignBoard
                ? (
                    <Image src={`/images/boards/${isOwner ? signBoard : meetingTemplate.signBoard}.png`} width="360px" height="244px" />
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
                <ProfileAvatar
                    className={styles.profileAvatar}
                    src={meetingTemplate?.user?.profileAvatar?.url}
                    width={isThereSignBoard ? '60px' : '40px'}
                    height={isThereSignBoard ? '60px' : '40px'}
                    userName={isOwner ? fullName : meetingTemplate.fullName}
                />
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
        </CustomGrid>
    );
});

export { MeetingGeneralInfo };
