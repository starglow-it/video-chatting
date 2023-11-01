import Carousel from 'react-material-ui-carousel';

import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { useStoreMap } from 'effector-react';
import { $meetingUsersStore } from 'src/store/roomStores';
import { MeetingAccessStatusEnum, MeetingRole } from 'shared-types';
import { MeetingVideosCarousel } from './MeetingVideosCarousel';
import { MeetingSelfView } from '../MeetingSelfView/MeetingSelfView';
import styles from './MeetingCarousel.module.scss';

export const MeetingCarousel = () => {
    const users = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state =>
            state.filter(
                user =>
                    user.accessStatus === MeetingAccessStatusEnum.InMeeting &&
                    user.meetingRole !== MeetingRole.Lurker,
            ),
    });
    const users1 = users.length < 7 ? users.slice(0, 7) : users;
    const users2 = users.length < 7 ? [] : users.slice(-4);

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
                <MeetingVideosCarousel users={users1} />
            </CustomGrid>
            <ConditionalRender condition={!!users2.length}>
                <CustomGrid
                    width="100%"
                    height="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="flex-start"
                    position="relative"
                >
                    <MeetingVideosCarousel users={users2} />
                </CustomGrid>
            </ConditionalRender>
        </Carousel>
    );
};
