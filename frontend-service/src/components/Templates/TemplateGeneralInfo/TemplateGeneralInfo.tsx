import React, { memo } from 'react';

// custom
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// components
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

// types
import { TemplateGeneralInfoProps } from './types';

// styles
import styles from './TemplateGeneralInfo.module.scss';

const TemplateGeneralInfo = memo(
    ({ profileAvatar = "", userName = "", companyName = "" }: TemplateGeneralInfoProps) => (
        <CustomGrid container className={styles.profileInfo}>
            <ProfileAvatar
                className={styles.profileAvatar}
                src={profileAvatar}
                width="40px"
                height="40px"
                userName={userName}
            />
            <CustomBox className={styles.companyName}>
                <CustomTypography color="colors.white.primary" className={styles.companyNameTitle}>
                    {companyName || 'Company Name'}
                </CustomTypography>
            </CustomBox>
        </CustomGrid>
    ),
);

export { TemplateGeneralInfo };
