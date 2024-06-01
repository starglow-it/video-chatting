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
    $meetingPanelsVisibilityForMobileStore,
    initialMeetingPanelsVisibilityData,
    sendMeetingReactionEvent,
    sendMeetingUnReactionEvent,
    setMeetingPanelsVisibilityForMobileEvent
} from 'src/store/roomStores';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { MeetingChatItem } from '../MeetingChatItem/MeetingChatItem';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

import styles from './MeetingChatList.module.scss';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

export const MeetingChatList = () => {
    const { list } = useStore($meetingChat);
    const isThereNewMessage = useStore($isThereNewMessage);

    const refScroll = useRef<any>(null);

    const { isMobileChatPanelVisible } = useStore($meetingPanelsVisibilityForMobileStore);

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

    const handleCloseMeetingChatPanel = useCallback(
        (e: MouseEvent | TouchEvent) => {
            e.stopPropagation();
            if (isMobileChatPanelVisible) {
                setMeetingPanelsVisibilityForMobileEvent({
                    ...initialMeetingPanelsVisibilityData,
                    isMobileChatPanelVisible: false
                });
            }
        },
        [isMobileChatPanelVisible],
    );

    return (
        <CustomGrid flex={1} display="flex" flexDirection="column">
            <IconButton className={styles.closeIconBtn} onClick={handleCloseMeetingChatPanel}>
                <CloseIcon className={styles.closeIcon} />
            </IconButton>
            <CustomGrid
                display="flex"
                alignItems="flex-start"
                justifyContent="flex-start"
                flexDirection="column"
                className={styles.imageWrapper}
            >
                <CustomTypography
                    variant='body1bold'
                    nameSpace="meeting"
                    translation="emptyChatNoteForMobile.title"
                    color="white"
                    className={styles.chatTitle}
                />
            </CustomGrid>
            <ConditionalRender condition={!list.length}>
                <CustomGrid
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    height="100%"
                    className={styles.noContentImageWrapper}
                >
                    <CustomImage
                        src="/images/empty-chat.png"
                        width={90}
                        height={100}
                        className={styles.imageEmpty}
                        loading="eager"
                        alt="media-item"
                    />
                    <span className={styles.textEmpty}>Chat is empty</span>
                    <span className={styles.textEmpty}>
                        Please type a message and send.
                    </span>
                </CustomGrid>
            </ConditionalRender>
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
