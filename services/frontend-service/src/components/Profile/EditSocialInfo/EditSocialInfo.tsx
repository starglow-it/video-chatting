import React, { memo } from 'react';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { SocialIcon } from 'shared-frontend/icons/OtherIcons/SocialIcon';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { Socials } from '@components/Socials/Socials';

// styles
import styles from './EditSocialInfo.module.scss';
import { CustomAccordion } from '@library/custom/CustomAccordion/CustomAccordion';

const EditSocialInfo = memo(() => {
    return (
        <CustomAccordion
            sumary={
                <>
                    <SocialIcon
                        width="24px"
                        height="24px"
                        className={styles.icon}
                    />
                    <CustomTypography
                        variant="body1"
                        fontWeight="600"
                        nameSpace="profile"
                        translation="social"
                        width="253px"
                    />
                    <CustomGrid
                        container
                        display="flex"
                        justifyContent="flex-start"
                    >
                        <CustomTypography
                            variant="body1"
                            nameSpace="profile"
                            translation="editProfile.social.title"
                        />
                    </CustomGrid>
                </>
            }
            detail={
                <CustomGrid
                    container
                    wrap="nowrap"
                    justifyContent="center"
                    alignItems="center"
                    className={styles.contentWrapper}
                >
                    <Socials buttonClassName={styles.socialBtn} />
                </CustomGrid>
            }
            sumaryProps={{classes:{
                content: styles.sumary
            }}}
            detailProps={{
                classes: {
                    root: styles.detail,
                },
            }}
        />
    );
});

export { EditSocialInfo };
