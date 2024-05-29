import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { useStore } from 'effector-react';
import {
    $isThereNewQuestion,
    $meetingQuestionAnswer,
} from 'src/store/roomStores/meeting/meetingQuestionAnswer/model';

import { useCallback, useEffect, useRef } from 'react';
import { MeetingReactionKind } from 'shared-types';
import {
    $isOwner,
    sendMeetingQuestionReactionEvent,
    sendMeetingQuestionUnReactionEvent,
} from 'src/store/roomStores';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { isMobile } from 'shared-utils';
import { MeetingQuestionAnswerItem } from '../MeetingQuestionAnswerItem/MeetingQuestionAnswerItem';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import styles from './MeetingQuestionAnswerList.module.scss';

export const MeetingQuestionAnswerList = () => {
    const { list } = useStore($meetingQuestionAnswer);
    const isThereNewQuestion = useStore($isThereNewQuestion);
    const isOwner = useStore($isOwner);


    const refScroll = useRef<any>(null);

    useEffect(() => {
        if (isThereNewQuestion) {
            if (refScroll.current)
                refScroll.current.scrollTop = refScroll.current?.scrollHeight;
        }
    }, [isThereNewQuestion]);

    const handleReaction = useCallback(
        (chatId: string, kind: MeetingReactionKind) => {
            sendMeetingQuestionReactionEvent({ meetingQuestionId: chatId, kind });
        },
        [],
    );

    const handleUnReaction = useCallback(
        (chatId: string, kind: MeetingReactionKind) => {
            sendMeetingQuestionUnReactionEvent({ meetingQuestionId: chatId, kind });
        },
        [],
    );

    const renderMessages = () => {
        return list.map((item, index) => (
            <MeetingQuestionAnswerItem
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
            <IconButton className={styles.closeIconBtn} onClick={() => { }}>
                <CloseIcon className={styles.closeIcon} />
            </IconButton>
            <CustomTypography
                variant="body1bold"
                nameSpace="meeting"
                translation="qaForMobile.title"
                color="white"
                className={styles.qaTitle}
            />
            <ConditionalRender condition={!list.length}>
                <CustomGrid
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                >
                    <CustomTypography
                        variant="body1"
                        nameSpace="meeting"
                        translation="qaForMobile.text"
                        color="white"
                    />
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
