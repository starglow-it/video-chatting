import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { MeetingChatItem } from '../MeetingChatItem.tsx/MeetingChatItem';

import styles from './MeetingChatList.module.scss';

export const MeetingChatList = () => {
    return (
        <CustomGrid flex={1} display="flex" flexDirection="column">
            <CustomScroll className={styles.scroll}>
                <MeetingChatItem type="time" />
                <MeetingChatItem />
                <MeetingChatItem type="recently" />
                <MeetingChatItem type="text" isLocal />
                <MeetingChatItem type="time" />
                <MeetingChatItem />
                <MeetingChatItem type="recently" />
                <MeetingChatItem type="text" isLocal />
            </CustomScroll>
        </CustomGrid>
    );
};
