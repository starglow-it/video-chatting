import Carousel from 'react-material-ui-carousel';

import styles from './MeetingCarousel.module.scss';
import { MeetingSelfView } from '../MeetingSelfView/MeetingSelfView';
import { MeetingUsersVideos } from '../MeetingUsersVideos/MeetingUsersVideos';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import clsx from 'clsx';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { RoundedVideo } from '@components/Media/RoundedVideo/RoundedVideo';

export const MeetingCarousel = () => {
    return (
        <Carousel
            className={styles.container}
            height="100%"
            navButtonsAlwaysVisible
            autoPlay={false}
        >
            <CustomGrid width="100%" height="100%" bgcolor="beige">
                <MeetingSelfView />
            </CustomGrid>
            <CustomGrid width="100%" height="100%" display="flex" justifyContent="center" alignItems="flex-start" position="relative">
               <CustomGrid display="flex" flexWrap="wrap" gap={1} justifyContent="space-around" width="100%" marginTop={3} position="absolute" top="100px">
               {[1, 2, 3, 4, 5].map(item => (
                    <CustomBox
                        className={clsx(styles.videoItem)}
                        sx={{
                            width: `135px`,
                            height: `135px`,
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
                            size={135}
                            isSelfView
                            isVideoSelfView
                        />
                    </CustomBox>
                ))}
               </CustomGrid>
            </CustomGrid>
        </Carousel>
    );
};
