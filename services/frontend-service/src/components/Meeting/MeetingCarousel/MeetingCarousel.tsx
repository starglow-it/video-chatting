import Carousel from 'react-material-ui-carousel';

import styles from './MeetingCarousel.module.scss';
import { MeetingSelfView } from '../MeetingSelfView/MeetingSelfView';
import { MeetingUsersVideos } from '../MeetingUsersVideos/MeetingUsersVideos';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import clsx from 'clsx';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { RoundedVideo } from '@components/Media/RoundedVideo/RoundedVideo';

export const MeetingCarousel = () => {
    const items = [
        {
            name: 'Random Name #1',
            description: 'Probably the most random thing you have ever seen!',
        },
        {
            name: 'Random Name #2',
            description: 'Hello World!',
        },
    ];
    return (
        <Carousel
            className={styles.container}
            height="100%"
            navButtonsAlwaysVisible
            autoPlay={false}
        >
            <CustomGrid width="100%" height="100%">
                <MeetingSelfView />
            </CustomGrid>
            <CustomGrid width="100%" height="100%" display="flex" justifyContent="center" alignItems="flex-start">
               <CustomGrid display="flex" flexWrap="wrap" gap={1} justifyContent="space-around" width="100%" marginTop={3}>
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
