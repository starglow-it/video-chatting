import { useEffect, memo } from 'react';
import { useStore, useStoreMap } from 'effector-react';

// components
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import { SocialLinks } from '@components/SocialLinks/SocialLinks';
import { ProfileDescription } from '@components/Profile/ProfileDescription/ProfileDescription';

// custom
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

// stores
import {
    $profileStore,
    $profileTemplatesStore,
    getProfileTemplatesFx,
} from '../../../store';

// styles
import styles from './MainInfo.module.scss';

const MainInfo = memo(() => {
    const profileState = useStore($profileStore);

    const lastProfileTemplate = useStoreMap({
        store: $profileTemplatesStore,
        keys: [],
        fn: state =>
            state?.list?.sort?.((a, b) =>
                new Date(a.usedAt as string).getTime() <
                new Date(b.usedAt as string).getTime()
                    ? 1
                    : 0,
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
                        <CustomTypography
                            className={styles.companyName}
                            variant="h4bold"
                        >
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
                </CustomGrid>
            </CustomGrid>
        </CustomPaper>
    );
});

export { MainInfo };
