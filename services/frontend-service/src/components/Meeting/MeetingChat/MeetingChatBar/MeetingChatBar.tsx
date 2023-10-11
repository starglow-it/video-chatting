/* eslint-disable react/jsx-no-duplicate-props */
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { useRef } from 'react';
import { sendMeetingChatEvent } from 'src/store/roomStores';
import { CustomEmojiPicker } from '@library/custom/CustomEmojiPicker/CustomEmojiPicker';
import { InputAdornment } from '@mui/material';
import { EmotionIcon } from 'shared-frontend/icons/OtherIcons/EmotionIcon';
import { EmojiClickData } from 'emoji-picker-react';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { SendIcon } from 'shared-frontend/icons/OtherIcons/SendIcon';
import styles from './MeetingChatBar.module.scss';

export const MeetingChatBar = () => {
    const refChatBar = useRef<any>(null);
    const refPicker = useRef<any>(null);

    const send = () => {
        if (refChatBar.current.value) {
            sendMeetingChatEvent({ body: refChatBar.current.value });
            refChatBar.current.value = '';
        }
    };
    const handleSendMessage = (e: any) => {
        if (e.key === 'Enter' || e.keyCode === '13') {
            e.preventDefault();
            send();
        }
    };

    const openPicker = () => {
        refPicker.current?.open();
    };

    const handleChooseEmoji = (data: EmojiClickData) => {
        console.log('#Duy Phan console', data);
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
                    ref={refChatBar}
                    placeholder="Type a message"
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
                    onKeyDown={handleSendMessage}
                />
            </CustomGrid>
            <ActionButton
                variant="grey"
                onAction={send}
                className={styles.sendButton}
                Icon={<SendIcon width="22px" height="22px" />}
            />
        </CustomGrid>
    );
};
