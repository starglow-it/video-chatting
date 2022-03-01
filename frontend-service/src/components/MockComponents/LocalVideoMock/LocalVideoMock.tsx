import React, { memo } from 'react';

// custom
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { RoundedVideo } from '@components/Media/RoundedVideo/RoundedVideo';

// icons
import { MicIcon } from '@library/icons/MicIcon';

// styles
import styles from './LocalVideoMock.module.scss';

// types
import { LocalVideoMockProps } from './types';

const LocalVideoMock = memo(({ userName, userProfileAvatar }: LocalVideoMockProps) => (
    <CustomGrid container direction="column" alignItems="center" className={styles.videoWrapper}>
        <CustomBox className={styles.media}>
            <RoundedVideo
                className={styles.video}
                userName={userName}
                userProfilePhoto={userProfileAvatar}
                size={120}
            />
        </CustomBox>
        <CustomPaper className={styles.usernameWrapper} variant="black-glass">
            <CustomGrid container alignItems="center" wrap="nowrap">
                <MicIcon isActive width="18px" height="18px" className={styles.micIcon} />
                <CustomTypography color="common.white" variant="body2" className={styles.username}>
                    {userName}
                </CustomTypography>
            </CustomGrid>
        </CustomPaper>
    </CustomGrid>
));

export { LocalVideoMock };
