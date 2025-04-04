/* eslint-disable jsx-a11y/no-static-element-interactions */
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { useStore } from 'effector-react';
import { useEffect, useRef, useState } from 'react';
import {
    $isThereNewTranscriptionMessage,
    $transcriptionQueue,
    setTranscriptionsEvent
} from 'src/store/roomStores';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { isMobile } from 'shared-utils';

import styles from './MeetingChatList.module.scss';
import { MeetingTranscribeItem } from '../MeetingChatItem/MeetingTranscribeItem';

export const MeetingTranscribeList = () => {
    const transcriptionQueue = useStore($transcriptionQueue);
    const [showNewMessageToast, setShowNewMessageToast] = useState(false);

    function deduplicateText(input: string) {
        const tokens = input.split(/\W+/);
        const seen = new Set();
        const result: any = [];
    
        tokens.forEach(token => {
            const phrase = token.toLowerCase();
            if (!seen.has(phrase) && phrase.trim() !== "") {
                seen.add(phrase);
                result.push(token);
            }
        });
    
        return result.join(" ");
    }

    const transcriptionList = transcriptionQueue.map(element => ({
        body: deduplicateText(element.message),
        id: element.sender + new Date().getTime(),
        sender: {
            id: element.sender,
            username: element.sender,
            profileAvatar: '',
        },
    }));

    const isThereNewMessage = useStore($isThereNewTranscriptionMessage);

    const refScroll = useRef<any>(null);

    useEffect(() => {
        if (isThereNewMessage) {
            if (
                refScroll.current &&
                // eslint-disable-next-line no-unsafe-optional-chaining
                +refScroll.current?.scrollHeight -
                refScroll.current.scrollTop <=
                500
            )
                refScroll.current.scrollTop = refScroll.current?.scrollHeight;
            else {
                setShowNewMessageToast(true);
            }
        }

        setTranscriptionsEvent(transcriptionQueue);
    }, [isThereNewMessage]);


    const renderMessages = () => {
        return transcriptionList.map((item, index) => (
            <MeetingTranscribeItem {...item} key={item.id + index} />
        ));
    };

    return (
        <CustomGrid flex={1} display="flex" flexDirection="column">
            <ConditionalRender condition={!transcriptionList.length}>
                <CustomGrid
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    height="100%"
                    className={styles.imageWrapper}
                >
                    <CustomImage
                        src="/images/empty-chat.png"
                        width={isMobile() ? 90 : 130}
                        height={isMobile() ? 100 : 150}
                        className={styles.imageEmpty}
                        loading="eager"
                        alt="media-item"
                    />
                    <span className={styles.textEmpty}>Transcript is empy</span>
                </CustomGrid>
            </ConditionalRender>
            <ConditionalRender condition={!!transcriptionList.length}>
                <CustomScroll
                    className={styles.transcribeScroll}
                    containerRef={(refS: any) => (refScroll.current = refS)}
                >
                    {renderMessages()}
                </CustomScroll>
            </ConditionalRender>
            {showNewMessageToast && (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <div
                    className={styles.newMessageToast}
                    onClick={() => {
                        setShowNewMessageToast(false);
                        refScroll.current.scrollTop =
                            refScroll.current?.scrollHeight;
                    }}
                >
                    New Messages &darr;
                </div>
            )}
        </CustomGrid>
    );
};
