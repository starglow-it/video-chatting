/* eslint-disable react/jsx-no-duplicate-props */
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { useRef } from 'react';
import { sendMeetingChatEvent } from 'src/store/roomStores';
import { CustomEmojiPicker } from '@library/custom/CustomEmojiPicker/CustomEmojiPicker';
import { InputAdornment } from '@mui/material';
import { EmojiIcon } from 'shared-frontend/icons/OtherIcons/EmojiIcon';
import { EmojiClickData } from 'emoji-picker-react';
import styles from './MeetingChatBar.module.scss';

export const MeetingChatBar = () => {
    const refChatBar = useRef<any>(null);
    const refPicker = useRef<any>(null);
    const handleSendMessage = (e: any) => {
        if (e.key === 'Enter' || e.keyCode === '13') {
            e.preventDefault();
            if (refChatBar.current.value) {
                sendMeetingChatEvent({ body: refChatBar.current.value });
                refChatBar.current.value = '';
            }
        }
    };

    const openPicker = () => {
        refPicker.current?.open();
    };

    const handleChooseEmoji = (data: EmojiClickData) => {
        refChatBar.current.value += data.emoji;
    };

    return (
        <CustomGrid>
            <CustomEmojiPicker
                ref={refPicker}
                width={265}
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
                            <EmojiIcon
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
    );
};
