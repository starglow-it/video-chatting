import Carousel from 'react-material-ui-carousel';

import styles from './MeetingCarousel.module.scss';
import { MeetingSelfView } from '../MeetingSelfView/MeetingSelfView';
import { MeetingUsersVideos } from '../MeetingUsersVideos/MeetingUsersVideos';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import clsx from 'clsx';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { RoundedVideo } from '@components/Media/RoundedVideo/RoundedVideo';
import { MeetingVideosCarousel } from './MeetingVideosCarousel';
import { useEffect, useState } from 'react';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

export const MeetingCarousel = () => {
    const [time, setTime] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setTime(Date.now());
        }, 3000);
    }, []);

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
            <CustomGrid
                width="100%"
                height="100%"
                display="flex"
                justifyContent="center"
                alignItems="flex-start"
                position="relative"
            >
                <MeetingVideosCarousel />
            </CustomGrid>
            <ConditionalRender condition={!!time}>
                <CustomGrid
                    width="100%"
                    height="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="flex-start"
                    position="relative"
                >
                   
                    <MeetingVideosCarousel />
                </CustomGrid>
            </ConditionalRender>
        </Carousel>
    );
};
