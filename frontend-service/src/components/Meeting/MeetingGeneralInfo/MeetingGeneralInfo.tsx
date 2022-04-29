import React, { memo } from 'react';
import { useStore } from 'effector-react';
import { useFormContext, useWatch } from 'react-hook-form';
import clsx from 'clsx';
import Image from 'next/image';

// components
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

// custom
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// styles
import styles from './MeetingGeneralInfo.module.scss';

// store
import {$isOwner, $meetingTemplateStore} from '../../../store/meeting';

const MeetingGeneralInfo = memo(() => {
    const isOwner = useStore($isOwner);
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
                <CustomBox className={styles.companyName}>
                    <CustomTypography
                        color="colors.white.primary"
                        className={clsx(styles.companyNameTitle, {
                            [styles.withBoard]: isThereSignBoard,
                            [styles.withoutBoard]: !isThereSignBoard,
                        })}
                    >
                        {isOwner ? companyName : meetingTemplate.companyName}
                    </CustomTypography>
                </CustomBox>
            </CustomGrid>
        </CustomGrid>
    );
});

export { MeetingGeneralInfo };
