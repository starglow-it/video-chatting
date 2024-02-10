import { memo, useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { ClickAwayListener } from '@mui/material';
import clsx from 'clsx';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { useBrowserDetect } from '@hooks/useBrowserDetect';
import { useStore } from 'effector-react';
import { $profileStore } from 'src/store';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import styles from './EmojiList.module.scss';
import {
    $isAudience,
    $meetingEmojiListVisibilityStore,
    $meetingReactionsStore,
    removeMeetingReactionEvent,
    sendMeetingReactionSocketEvent
} from '../../store/roomStores';

const Component = () => {
    const { isMobile } = useBrowserDetect();
    const meetingReactions = useStore($meetingReactionsStore);
    const isAudience = useStore($isAudience);
    const profile = useStore($profileStore);
    const { isEmojiListVisible } = useStore($meetingEmojiListVisibilityStore);

    const [isExpand, setIsExpand] = useState<boolean>(true);

    const addReaction = (e) => {
        console.log(meetingReactions)
        sendMeetingReactionSocketEvent({
            emojiName: e.target.dataset.key,
        })
    }

    const availableReactionArr = [
        {
            text: "rocket",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/512.gif"
        },
        {
            text: "party-popper",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif"
        },
        {
            text: "fire",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.gif"
        },
        {
            text: "raising-hands",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f64c/512.gif"
        },
        {
            text: "sparkling-heart",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f496/512.gif"
        },
        {
            text: "folded-hands",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f64f/512.gif"
        },
        {
            text: "partying-face",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f973/512.gif"
        },
        {
            text: "mind-blown",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f92f/512.gif"
        },
        {
            text: "joy",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f602/512.gif"
        },
        {
            text: "screaming",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f631/512.gif"
        },
        {
            text: "hearted-eyes",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f60d/512.gif"
        },
        {
            text: "thinking-face",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f914/512.gif"
        },
        {
            text: "see-no-evil-monkeys",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f648/512.gif"
        },
        {
            text: "light-bulb",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f4a1/512.gif"
        },
        {
            text: "person-raising-hands",
            icon: "https://img.icons8.com/emoji/96/person-raising-hand.png"
        },
        {
            text: "thumbs-up",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f44d/512.gif"
        },
        {
            text: "wave",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f44b/512.gif"
        },
        {
            text: "okay",
            icon: "https://img.icons8.com/emoji/96/ok-hand-emoji.png"
        }
    ];

    return (
        <ClickAwayListener onClickAway={() => setIsExpand(false)}>
            <div>
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
                                        <img className={styles.emojiBtn} onClick={addReaction} src={reaction.icon} data-key={reaction.text} height="30" />
                                    </CustomGrid>
                                ))}
                            </ConditionalRender>
                        </CustomGrid>
                    </CustomPaper>
                }
            </div>
        </ClickAwayListener>
    );
};

export const EmojiList = memo(Component);
