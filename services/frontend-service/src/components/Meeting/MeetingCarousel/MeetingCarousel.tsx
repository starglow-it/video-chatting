import Carousel from 'react-material-ui-carousel';

import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { useStore, useStoreMap } from 'effector-react';
import { $isLurker, $meetingUsersStore } from 'src/store/roomStores';
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
    const isLurker = useStore($isLurker);
    const users1 = users.length < 6 ? users : users.slice(0, 5);
    const users2 = users.length < 6 ? [] : users.slice(6, 11);

    const renderMain = () => {
        const elements: any = [];
        if (!isLurker)
            elements.push(
                <CustomGrid width="100%" height="100%" bgcolor="beige">
                    <MeetingSelfView />
                </CustomGrid>,
            );
        if (users1.length)
            elements.push(
                <CustomGrid
                    width="100%"
                    height="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="flex-start"
                    position="relative"
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
                    alignItems="flex-start"
                    position="relative"
                >
                    <MeetingVideosCarousel users={users2} />
                </CustomGrid>,
            );
        return elements;
    };

    return (
        <Carousel
            className={styles.container}
            height="100%"
            navButtonsAlwaysVisible
            autoPlay={false}
        >
            {renderMain()}
        </Carousel>
    );
};
