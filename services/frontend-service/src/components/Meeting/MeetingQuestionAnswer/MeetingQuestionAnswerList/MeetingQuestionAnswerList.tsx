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
    sendMeetingQuestionReactionEvent,
    sendMeetingQuestionUnReactionEvent,
} from 'src/store/roomStores';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { isMobile } from 'shared-utils';
import { MeetingQuestionAnswerItem } from '../MeetingQuestionAnswerItem/MeetingQuestionAnswerItem';

import styles from './MeetingQuestionAnswerList.module.scss';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

export const MeetingQuestionAnswerList = () => {
    const { list } = useStore($meetingQuestionAnswer);
    const isThereNewQuestion = useStore($isThereNewQuestion);

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
            <ConditionalRender condition={!list.length}>
                <CustomGrid
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    height="100%"
                >
                    <CustomBox className={styles.imageBox}>
                        <CustomImage
                            src="/images/question-mark.png"
                            width={isMobile() ? 45 : 65}
                            height={isMobile() ? 75 : 107}
                            className={styles.imageEmpty}
                            loading="eager"
                            alt="media-item"
                        />
                    </CustomBox>
                    <span className={styles.textEmpty}>
                        please type a question and send.
                    </span>
                    <span className={styles.textEmpty}>
                        only one question can be asked at a time.
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
