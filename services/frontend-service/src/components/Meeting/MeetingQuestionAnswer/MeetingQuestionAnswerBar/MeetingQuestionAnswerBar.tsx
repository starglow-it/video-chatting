/* eslint-disable react/jsx-no-duplicate-props */
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { useEffect, useRef, useState } from 'react';
import { $meetingQuestionAnswer, $meetingStore, sendMeetingQuestionAnswerEvent } from 'src/store/roomStores';
import { CustomEmojiPicker } from '@library/custom/CustomEmojiPicker/CustomEmojiPicker';
import { InputAdornment } from '@mui/material';
import { EmotionIcon } from 'shared-frontend/icons/OtherIcons/EmotionIcon';
import { EmojiClickData } from 'emoji-picker-react';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { SendIcon } from 'shared-frontend/icons/OtherIcons/SendIcon';
import styles from './MeetingQuestionAnswerBar.module.scss';
import { useStore } from 'effector-react';
import { MeetingReactionKind } from 'shared-types';

export const MeetingQuestionAnswerBar = () => {
    const [limitQuestion, setLimitQuestion] = useState(false);
    const refChatBar = useRef<any>(null);
    const refPicker = useRef<any>(null);
    const meeting = useStore($meetingStore);
    const { list } = useStore($meetingQuestionAnswer);

    useEffect(() => {
        let count = 0;
        list.map(item => {
            const reactionCounts = Object.keys(item.reactions) as MeetingReactionKind[];
            count = reactionCounts.length == 0 ? count + 1 : count;
        });
        setLimitQuestion(count >= 3);
    }, [list])

    const send = () => {
        if (limitQuestion) return;
        if (refChatBar.current.value) {
            sendMeetingQuestionAnswerEvent({ meetingId: meeting.id, body: refChatBar.current.value });
            refChatBar.current.value = '';
        }
    };

    const handleSendQuestion = (e: any) => {
        if (e.key === 'Enter' || e.keyCode === '13') {
            e.preventDefault();
            send();
        }
    };

    const openPicker = () => {
        refPicker.current?.open();
    };

    const handleChooseEmoji = (data: EmojiClickData) => {
        refChatBar.current.value += data.emoji;
    };

    return (
        <CustomGrid display="flex" alignItems="center">
            <CustomGrid width="100%">
                <CustomEmojiPicker
                    ref={refPicker}
                    width={280}
                    className={styles.picker}
                    onEmojiClick={handleChooseEmoji}
                />
                <CustomInput
                    multiline
                    inputProps={{ className: styles.textField }}
                    maxRows={2}
                    ref={refChatBar}
                    placeholder={!limitQuestion ? "Type a message" : "Reached the limit of 3 Q"}
                    disabled={limitQuestion}
                    InputProps={{
                        classes: {
                            multiline: styles.rootField,
                            focused: styles.focused,
                        },
                        endAdornment: (
                            <InputAdornment position="end">
                                <EmotionIcon
                                    width="20px"
                                    height="20px"
                                    onClick={openPicker}
                                    className={styles.icon}
                                />
                            </InputAdornment>
                        ),
                    }}
                    onKeyDown={handleSendQuestion}
                />
            </CustomGrid>
            <ActionButton
                variant="grey"
                onAction={send}
                className={styles.sendButton}
                disabled={limitQuestion}
                Icon={<SendIcon width="22px" height="22px" />}
            />
        </CustomGrid>
    );
};
