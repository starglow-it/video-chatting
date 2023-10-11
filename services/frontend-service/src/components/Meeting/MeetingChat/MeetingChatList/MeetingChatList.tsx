import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { useStore } from 'effector-react';
import {
    $isThereNewMessage,
    $meetingChat,
} from 'src/store/roomStores/meeting/meetingChat/model';
import { useCallback, useEffect, useRef } from 'react';
import { MeetingChatItem } from '../MeetingChatItem/MeetingChatItem';

import styles from './MeetingChatList.module.scss';
import { MeetingReactionKind } from 'shared-types';
import { sendMeetingReactionEvent } from 'src/store/roomStores';

export const MeetingChatList = () => {
    const { list } = useStore($meetingChat);
    const isThereNewMessage = useStore($isThereNewMessage);

    const refScroll = useRef<any>(null);

    useEffect(() => {
        if (isThereNewMessage) {
            if (refScroll.current)
                refScroll.current.scrollTop = refScroll.current?.scrollHeight;
        }
    }, [isThereNewMessage]);

    const handleReaction = useCallback(
        (chatId: string, kind: MeetingReactionKind) => {
            sendMeetingReactionEvent({ meetingChatId: chatId, kind });
        },
        [],
    );

    const renderMessages = () => {
        return list.map((item, index) => (
            <MeetingChatItem
                {...item}
                key={item.id}
                isBreak={list[index - 1]?.sender?.id !== item?.sender?.id}
                onReaction={handleReaction}
            />
        ));
    };

    return (
        <CustomGrid flex={1} display="flex" flexDirection="column">
            <CustomScroll
                className={styles.scroll}
                containerRef={(refS: any) => (refScroll.current = refS)}
            >
                {renderMessages()}
            </CustomScroll>
        </CustomGrid>
    );
};
