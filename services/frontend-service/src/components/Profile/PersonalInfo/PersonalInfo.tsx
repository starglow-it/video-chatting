import React, { memo } from 'react';
import { useStore } from 'effector-react';

import { PersonIcon } from 'shared-frontend/icons';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid, CustomBox } from 'shared-frontend/library';

import styles from './PersonalInfo.module.scss';

// stores
import { $profileStore } from '../../../store';

const PersonalInfo = memo(() => {
    const profile = useStore($profileStore);

    return (
        <CustomGrid container>
            <CustomGrid container>
                <PersonIcon className={styles.personIcon} width="24px" height="24px" />
                <CustomTypography
                    variant="body1"
                    fontWeight="600"
                    nameSpace="profile"
                    translation="personalInfo.title"
                />
            </CustomGrid>
            <CustomBox
                gap={0.5}
                display="grid"
                gridTemplateColumns="repeat(3, 1fr)"
                gridTemplateRows="repeat(3, min-content)"
                className={styles.infoWrapper}
            >
                <CustomTypography
                    gridArea="1/1/1/1"
                    color="text.secondary"
                    nameSpace="profile"
                    translation="personalInfo.name"
                />
                <CustomTypography
                    gridArea="2/1/2/1"
                    color="text.secondary"
                    nameSpace="profile"
                    translation="personalInfo.position"
                />
                <CustomTypography
                    gridArea="3/1/3/1"
                    color="text.secondary"
                    nameSpace="profile"
                    translation="personalInfo.languages"
                />
                <CustomBox gridArea="1/2/1/4" className={styles.fullNameWrapper}>
                    <CustomTypography className={styles.fullNameText} color="text.primary">
                        {profile?.fullName}
                    </CustomTypography>
                </CustomBox>
                <CustomBox gridArea="2/2/2/4" className={styles.positionWrapper}>
                    <CustomTypography className={styles.positionText} color="text.primary">
                        {profile?.position}
                    </CustomTypography>
                </CustomBox>
                <CustomTypography gridArea="3/2/3/4" color="text.primary">
                    {profile.languages.map(lang => lang.value).join(', ')}
                </CustomTypography>
            </CustomBox>
        </CustomGrid>
    );
});

export { PersonalInfo };
