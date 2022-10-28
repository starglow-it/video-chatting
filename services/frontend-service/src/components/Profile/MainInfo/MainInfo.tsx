import React, { useEffect, memo } from 'react';
import { useStore, useStoreMap } from 'effector-react';

// components
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import { SocialLinks } from '@components/SocialLinks/SocialLinks';
import { ProfileDescription } from '@components/Profile/ProfileDescription/ProfileDescription';
import { ProfileBusinessTags } from '@components/Profile/ProfileBusinessTags/ProfileBusinessTags';

// common
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// custom
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

// shared
import { CustomImage } from 'shared-frontend/library';

// stores
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { $profileStore, $profileTemplatesStore, getProfileTemplatesFx } from '../../../store';

// styles
import styles from './MainInfo.module.scss';

const MainInfo = memo(() => {
    const profileState = useStore($profileStore);

    const lastProfileTemplate = useStoreMap({
        store: $profileTemplatesStore,
        keys: [],
        fn: state =>
            state?.list?.sort?.((a, b) =>
                new Date(a.usedAt).getTime() < new Date(b.usedAt).getTime() ? 1 : 0,
            )?.[0],
    });

    useEffect(() => {
        getProfileTemplatesFx({ limit: 6, skip: 0 });
    }, []);

    const previewImage = (lastProfileTemplate?.previewUrls || []).find(
        image => image.resolution === 1080,
    );

    return (
        <CustomPaper className={styles.wrapper}>
            <CustomGrid container direction="column">
                <SocialLinks />
                <CustomBox className={styles.imageWrapper}>
                    <ConditionalRender condition={Boolean(previewImage?.url)}>
                        <CustomImage
                            src={previewImage?.url ?? ''}
                            width="100%"
                            height="100%"
                            layout="fill"
                            objectFit="cover"
                            objectPosition="center"
                        />
                    </ConditionalRender>
                </CustomBox>
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
