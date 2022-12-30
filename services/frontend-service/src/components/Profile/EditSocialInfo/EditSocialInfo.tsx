import React, { memo } from 'react';

// custom
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { SocialIcon } from 'shared-frontend/icons/OtherIcons/SocialIcon';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

// components
import { Socials } from '@components/Socials/Socials';

// styles
import styles from './EditSocialInfo.module.scss';

const EditSocialInfo = memo(() => {
    return (
        <CustomPaper className={styles.paperWrapper}>
            <CustomBox
                display="grid"
                gridTemplateColumns="minmax(110px, 192px) 1fr"
                gridTemplateRows="repeat(1, 1fr)"
            >
                <CustomBox gridArea="1/1/1/1">
                    <CustomGrid container alignItems="center">
                        <SocialIcon width="24px" height="24px" className={styles.icon} />
                        <CustomTypography
                            variant="body1"
                            fontWeight="600"
                            nameSpace="profile"
                            translation="social"
                        />
                    </CustomGrid>
                </CustomBox>
                <CustomGrid
                    gridArea="1/2/1/2"
                    container
                    wrap="nowrap"
                    className={styles.contentWrapper}
                >
                    <Socials
                        title={(
                            <CustomTypography
                                variant="body1"
                                nameSpace="profile"
                                translation="editProfile.social.title"
                            />
                        )}
                        buttonClassName={styles.socialBtn}
                    />
                </CustomGrid>
            </CustomBox>
        </CustomPaper>
    );
});

export { EditSocialInfo };
