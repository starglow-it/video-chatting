import clsx from 'clsx';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { RoundedVideo } from '@components/Media/RoundedVideo/RoundedVideo';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import styles from './MeetingCarousel.module.scss';

export const MeetingVideosCarousel = () => {
    return (
        <CustomGrid
            display="flex"
            flexWrap="wrap"
            gap={1}
            justifyContent="space-around"
            width="100%"
            marginTop={3}
            position="absolute"
            top="100px"
            padding="18px"
        >
            <CustomPaper variant="black-glass" className={styles.paper}>
                <CustomGrid
                    display="flex"
                    flexWrap="wrap"
                    gap={1}
                    justifyContent="space-around"
                    padding="10px"
                >
                    {[1, 2].map(item => (
                        <CustomBox
                            className={clsx(styles.videoItem)}
                            sx={{
                                width: `120px`,
                            }}
                            key={item}
                        >
                            <RoundedVideo
                                isLocal
                                isCameraActive
                                isVideoAvailable
                                userName="Duy"
                                userProfilePhoto=""
                                // videoRef={container}
                                size={120}
                                isSelfView={false}
                                isVideoSelfView={false}
                            />
                            <CustomPaper
                                className={clsx(styles.usernameWrapper)}
                                variant="black-glass"
                            >
                                <CustomTypography
                                    color="common.white"
                                    variant="body3"
                                    className={styles.username}
                                >
                                    Duy
                                </CustomTypography>
                            </CustomPaper>
                        </CustomBox>
                    ))}
                </CustomGrid>
            </CustomPaper>
        </CustomGrid>
    );
};
