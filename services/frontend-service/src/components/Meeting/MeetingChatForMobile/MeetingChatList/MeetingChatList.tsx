import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { useStore } from 'effector-react';
import {
    $isThereNewMessage,
    $meetingChat,
} from 'src/store/roomStores/meeting/meetingChat/model';
import { useCallback, useEffect, useRef } from 'react';
import { MeetingReactionKind } from 'shared-types';
import {
    sendMeetingReactionEvent,
    sendMeetingUnReactionEvent,
} from 'src/store/roomStores';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { isMobile } from 'shared-utils';
import { MeetingChatItem } from '../MeetingChatItem/MeetingChatItem';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import styles from './MeetingChatList.module.scss';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

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

    const handleUnReaction = useCallback(
        (chatId: string, kind: MeetingReactionKind) => {
            sendMeetingUnReactionEvent({ meetingChatId: chatId, kind });
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
                onUnReaction={handleUnReaction}
            />
        ));
    };

    return (
        <CustomGrid flex={1} display="flex" flexDirection="column">
            <IconButton className={styles.closeIconBtn} onClick={() => {}}>
                <CloseIcon className={styles.closeIcon} />
            </IconButton>
            <CustomGrid
                display="flex"
                alignItems="flex-start"
                justifyContent="flex-start"
                flexDirection="column"
                height="100%"
                className={styles.imageWrapper}
            >
                <CustomTypography
                    variant='body1bold'
                    nameSpace="meeting"
                    translation="emptyChatNoteForMobile.title"
                    color="white"
                    className={styles.chatTitle}
                />
                <CustomTypography
                    variant='body1'
                    nameSpace="meeting"
                    translation="emptyChatNoteForMobile.text"
                    color="white"
                />
            </CustomGrid>
            <ConditionalRender condition={!!list.length}>
                <CustomScroll
                    className={styles.scroll}
                    containerRef={(refS: any) => (refScroll.current = refS)}
                >
                    {renderMessages()}
                </CustomScroll>
            </ConditionalRender>
        </CustomGrid>
    );
};
