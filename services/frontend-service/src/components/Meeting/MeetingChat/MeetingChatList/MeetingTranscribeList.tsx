/* eslint-disable jsx-a11y/no-static-element-interactions */
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { useEffect, useRef, useState } from 'react';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { isMobile } from 'shared-utils';

import styles from './MeetingChatList.module.scss';
import { MeetingTranscribeItem } from '../MeetingChatItem/MeetingTranscribeItem';

export const MeetingTranscribeList = ({ lines }: any) => {
    const [showNewMessageToast, setShowNewMessageToast] = useState(false);
    const refScroll = useRef<any>(null);

    useEffect(() => {
        if (lines && lines.length > 0 && refScroll.current) {
            if (+refScroll.current.scrollHeight - refScroll.current.scrollTop <= 500) {
                refScroll.current.scrollTop = refScroll.current.scrollHeight;
            } else {
                setShowNewMessageToast(true);
            }
        }
    }, [lines]);

    const renderMessages = () => {
        return lines.map((line: any, index: any) => (
            <MeetingTranscribeItem
                key={`transcript-${line.channel}-${index}`}
                type="text"
                body={line.text || ""}
                sender={{ id: line.channel, username: "Transcription Service" }}
                isBreak={line.partial}
            />
        ));
    };

    return (
        <CustomGrid flex={1} display="flex" flexDirection="column">
            <ConditionalRender condition={!lines.length}>
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
                    <span className={styles.textEmpty}>Transcript is empty</span>
                </CustomGrid>
            </ConditionalRender>
            <ConditionalRender condition={!!lines.length}>
                <CustomScroll
                    className={styles.transcribeScroll}
                    containerRef={(refS) => (refScroll.current = refS)}
                >
                    {renderMessages()}
                </CustomScroll>
            </ConditionalRender>
            {showNewMessageToast && (
                <div
                    className={styles.newMessageToast}
                    onClick={() => {
                        setShowNewMessageToast(false);
                        refScroll.current.scrollTop = refScroll.current.scrollHeight;
                    }}
                >
                    New Messages &darr;
                </div>
            )}
        </CustomGrid>
    );
};
