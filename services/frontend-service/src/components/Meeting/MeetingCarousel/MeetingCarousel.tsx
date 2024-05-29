import Carousel from 'react-material-ui-carousel';

import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { useStore, useStoreMap } from 'effector-react';
import { $isAudience, $meetingUsersStore } from 'src/store/roomStores';
import { MeetingAccessStatusEnum, MeetingRole } from 'shared-types';
import { MeetingVideosCarousel } from './MeetingVideosCarousel';
import styles from './MeetingCarousel.module.scss';

export const MeetingCarousel = () => {
    const users = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state =>
            state.filter(
                user =>
                    user.accessStatus === MeetingAccessStatusEnum.InMeeting &&
                    user.meetingRole !== MeetingRole.Audience,
            ),
    });
    const isAudience = useStore($isAudience);
    const users1 = users.length < 6 ? users : users.slice(0, 5);
    const users2 = users.length < 6 ? [] : users.slice(5, 11);

    const elements: any = [];
    if (users1.length)
        elements.push(
            <CustomGrid
                width="100%"
                height="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                position="relative"
                key="1"
            >
                <MeetingVideosCarousel users={users1} />
            </CustomGrid>,
        );
    if (users2.length)
        elements.push(
            <CustomGrid
                width="100%"
                height="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                position="relative"
                key="2"
            >
                <MeetingVideosCarousel users={users2} />
            </CustomGrid>,
        );

    return (
        <CustomGrid className={styles.container}>
            <Carousel
                navButtonsAlwaysVisible={!isAudience && users2.length}
                autoPlay={false}
                height="100%"
                sx={{ height: '100%' }}
                navButtonsAlwaysInvisible={isAudience && !users2.length}
            >
                {elements}
            </Carousel>
        </CustomGrid>
    );
};
