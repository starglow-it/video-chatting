import { React, memo, useState } from 'react';

import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { ClickAwayListener } from '@mui/material';
import clsx from 'clsx';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { useBrowserDetect } from '@hooks/useBrowserDetect';
import { useStore } from 'effector-react';
import { $profileStore } from 'src/store';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import styles from './EmojiList.module.scss';
import {
    $isAudience,
    $meetingEmojiListVisibilityStore,
    sendMeetingReactionSocketEvent,
    setEmojiListVisibilityEvent
} from '../../store/roomStores';

const Component = () => {
    const { isMobile } = useBrowserDetect();
    const isAudience = useStore($isAudience);
    const profile = useStore($profileStore);
    const { isEmojiListVisible } = useStore($meetingEmojiListVisibilityStore);

    // const [isExpand, setIsExpand] = useState<boolean>(true);

    const addReaction = (event: React.MouseEvent<HTMLImageElement>) => {
        sendMeetingReactionSocketEvent({
            emojiName: event.target.dataset.key,
        })
    }

    const availableReactionArr = [
        {
            text: "rocket",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/512.gif",
            isForAudience: true
        },
        {
            text: "party-popper",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif",
            isForAudience: true
        },
        {
            text: "fire",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.gif",
            isForAudience: true
        },
        {
            text: "raising-hands",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f64c/512.gif",
            isForAudience: true
        },
        {
            text: "sparkling-heart",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f496/512.gif",
            isForAudience: true
        },
        {
            text: "folded-hands",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f64f/512.gif",
            isForAudience: true
        },
        {
            text: "partying-face",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f973/512.gif",
            isForAudience: false
        },
        {
            text: "mind-blown",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f92f/512.gif",
            isForAudience: true
        },
        {
            text: "joy",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f602/512.gif",
            isForAudience: true
        },
        {
            text: "screaming",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f631/512.gif",
            isForAudience: false
        },
        {
            text: "hearted-eyes",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f60d/512.gif",
            isForAudience: true
        },
        {
            text: "thinking-face",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f914/512.gif",
            isForAudience: false
        },
        {
            text: "see-no-evil-monkeys",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f648/512.gif",
            isForAudience: false
        },
        {
            text: "light-bulb",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f4a1/512.gif",
            isForAudience: false
        },
        {
            text: "person-raising-hands",
            icon: "https://img.icons8.com/emoji/96/person-raising-hand.png",
            isForAudience: false
        },
        {
            text: "thumbs-up",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f44d/512.gif",
            isForAudience: true
        },
        {
            text: "wave",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f44b/512.gif",
            isForAudience: true
        },
        {
            text: "okay",
            icon: "https://img.icons8.com/emoji/96/ok-hand-emoji.png",
            isForAudience: true
        }
    ];

    return (
        // <ClickAwayListener onClickAway={() => setIsExpand(false)}>
        <ClickAwayListener onClickAway={() => setEmojiListVisibilityEvent({ isEmojiListVisible: false })}>
            <>
                {isEmojiListVisible &&
                    <CustomPaper
                        className={clsx(styles.commonOpenPanel, {
                            [styles.mobile]: isMobile,
                        })}
                        variant="black-glass"
                    >
                        <CustomGrid
                            container
                            alignItems="center"
                            flexDirection="row"
                            justifyContent="center"
                        >
                            <ConditionalRender
                                condition={!isAudience || !!profile.id}
                            >
                                {availableReactionArr.map(reaction => (
                                    <CustomGrid item xs={4} className={styles.center}>
                                        <CustomBox className={styles.emojiBox}>
                                            <CustomImage className={styles.emojiBtn} onClick={addReaction} src={reaction.icon} data-key={reaction.text} width="30" height="30" />
                                        </CustomBox>
                                    </CustomGrid>
                                ))}
                            </ConditionalRender>
                            <ConditionalRender
                                condition={isAudience}
                            >
                                {availableReactionArr.filter(reaction => reaction.isForAudience).map(reaction => (
                                    <CustomGrid item xs={4} className={styles.center}>
                                        <CustomBox className={styles.emojiBox}>
                                            <CustomImage className={styles.emojiBtn} onClick={addReaction} src={reaction.icon} data-key={reaction.text} width="30" height="30" />
                                        </CustomBox>
                                    </CustomGrid>
                                ))}
                            </ConditionalRender>
                        </CustomGrid>
                    </CustomPaper>
                }
            </>
        </ClickAwayListener>
    );
};

export const EmojiList = memo(Component);
