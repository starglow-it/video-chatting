import React, { memo } from 'react';
import { useStore } from 'effector-react';
import Image from 'next/image';

// components
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import { SocialLinks } from '@components/SocialLinks/SocialLinks';
import { ProfileDescription } from '@components/Profile/ProfileDescription/ProfileDescription';
import { ProfileBusinessTags } from '@components/Profile/ProfileBusinessTags/ProfileBusinessTags';

// custom
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

// stores
import { $profileStore } from '../../../store';

// styles
import styles from './MainInfo.module.scss';

// types

const MainInfo = memo(() => {
    const profileState = useStore($profileStore);

    return (
        <CustomPaper className={styles.wrapper}>
            <CustomGrid container direction="column">
                <SocialLinks />
                <Image src="/images/defaultTemplateImage.png" width="100%" height="210px" />
                <CustomGrid
                    className={styles.profileInfoWrapper}
                    container
                    direction="row"
                    flexWrap="nowrap"
                >
                    <CustomGrid className={styles.profileAvatarWrapper}>
                        <ProfileAvatar
                            className={styles.profileImage}
                            width="90px"
                            height="90px"
                            src={profileState?.profileAvatar?.url}
                            userName={profileState.fullName}
                        />
                    </CustomGrid>
                    <CustomGrid
                        container
                        direction="column"
                        flexWrap="nowrap"
                        className={styles.descriptionWrapper}
                    >
                        <CustomTypography className={styles.companyName} variant="h4bold">
                            {profileState?.companyName}
                        </CustomTypography>
                        <CustomTypography
                            className={styles.profileEmail}
                            variant="body2"
                            color="colors.blue.primary"
                        >
                            {profileState?.email}
                        </CustomTypography>
                        <ProfileDescription />
                    </CustomGrid>
                    <ProfileBusinessTags />
                </CustomGrid>
            </CustomGrid>
        </CustomPaper>
    );
});

export { MainInfo };
