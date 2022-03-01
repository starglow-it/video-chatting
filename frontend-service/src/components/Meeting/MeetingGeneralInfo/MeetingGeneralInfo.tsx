import React, { memo } from 'react';
import { useStore } from 'effector-react';
import { useFormContext, useWatch } from 'react-hook-form';

// components
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

// custom
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// styles
import styles from './MeetingGeneralInfo.module.scss';

// store
import { $profileStore } from '../../../store/profile';

const MeetingGeneralInfo = memo(() => {
    const { control } = useFormContext();

    const profile = useStore($profileStore);

    const companyName = useWatch({
        control,
        name: 'companyName',
    });

    const fullName = useWatch({
        control,
        name: 'fullName',
    });

    return (
        <CustomGrid container className={styles.profileInfo}>
            <ProfileAvatar
                className={styles.profileAvatar}
                src={profile?.profileAvatar?.url}
                width="40px"
                height="40px"
                userName={fullName}
            />
            <CustomBox className={styles.companyName}>
                <CustomTypography color="colors.white.primary" className={styles.companyNameTitle}>
                    {companyName}
                </CustomTypography>
            </CustomBox>
        </CustomGrid>
    );
});

export { MeetingGeneralInfo };
