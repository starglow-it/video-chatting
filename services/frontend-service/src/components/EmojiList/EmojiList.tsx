import { memo, useCallback, useState } from 'react';
import * as yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { Theme } from '@mui/system';
import createStyles from '@mui/styles/createStyles';
import { makeStyles } from '@mui/styles';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';
import { SendIcon } from 'shared-frontend/icons/OtherIcons/SendIcon';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';

// components
import { ActionButton } from 'shared-frontend/library/common/ActionButton';

// const

// validation

// stores

// styles
import { ClickAwayListener } from '@mui/material';
import clsx from 'clsx';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { useBrowserDetect } from '@hooks/useBrowserDetect';
import { useStore } from 'effector-react';
import { $profileStore, addNotificationEvent } from 'src/store';
import { NotificationType } from 'src/store/types';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import styles from './EmojiList.module.scss';
import {
    $isAudience,
    $meetingNotesStore,
    $meetingEmojiListVisibilityStore,
    sendMeetingNoteSocketEvent,
} from '../../store/roomStores';
import { simpleStringSchemaWithLength } from '../../validation/common';
import { MAX_NOTE_CONTENT } from '../../const/general';
import config from '../../const/config';

const validationSchema = yup.object({
    note: simpleStringSchemaWithLength(MAX_NOTE_CONTENT).required('required'),
});

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                    color: '#77777a',
                },
            },
            '& .MuiOutlinedInput-root': {
                background: '#c2bdbd',
                color: theme.palette.colors.black.primary,
                '&.Mui-focused, &:hover': {
                    color: theme.palette.colors.black.primary,
                },
                height: '35px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '8px',
            },
            '& .MuiFormLabel-root': {
                color: 'black',
                top: '-8px',
                fontSize: '14px',
            },
            '& .Mui-focused': {
                top: 0,
            },
            '& .MuiFormLabel-filled': {
                top: 0,
            },
        },
    }),
);

type FormType = { note: string };

const Component = () => {
    const { isMobile } = useBrowserDetect();
    const materialStyles = useStyles();
    const meetingNotes = useStore($meetingNotesStore);
    const isAudience = useStore($isAudience);
    const profile = useStore($profileStore);
    const resolver = useYupValidationResolver<FormType>(validationSchema);
    const { isEmojiListVisible } = useStore($meetingEmojiListVisibilityStore);

    const methods = useForm({
        resolver,
        defaultValues: { note: '' },
    });

    const { reset, register, getValues } = methods;

    const [isExpand, setIsExpand] = useState<boolean>(true);

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter' || e.keyCode === '13') {
            if (meetingNotes.length < 3) {
                sendMeetingNoteSocketEvent(getValues());
                reset();
            } else {
                addNotificationEvent({
                    message: 'Notes is limited to 3 on screen',
                    type: NotificationType.validationError,
                });
            }
        }
    };

    const { onChange, ...restRegisterData } = register('note', {
        maxLength: MAX_NOTE_CONTENT,
    });

    const handleChange = useCallback(async (event: any) => {
        if (event.target.value.length > MAX_NOTE_CONTENT) {
            /* eslint-disable no-param-reassign */
            event.target.value = event.target.value.slice(0, MAX_NOTE_CONTENT);
            /* eslint-enable no-param-reassign */
        }

        await onChange(event);
    }, []);

    const sendNote = () => {
        if (meetingNotes.length < 3) {
            sendMeetingNoteSocketEvent(getValues());
            reset();
        } else {
            addNotificationEvent({
                message: 'Notes is limited to 3 on screen',
                type: NotificationType.validationError,
            });
        }
    };


    const availableReactionArr = [
        {
            text: ":rocket:",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/512.gif"
        },
        {
            text: ":party-popper:",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif"
        },
        {
            text: ":fire:",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.gif"
        },
        {
            text: ":raising-hands:",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f64c/512.gif"
        },
        {
            text: ":sparkling-heart:",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f496/512.gif"
        },
        {
            text: ":folded-hands:",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f64f/512.gif"
        },
        {
            text: ":partying-face:",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f973/512.gif"
        },
        {
            text: ":mind-blown:",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f92f/512.gif"
        },
        {
            text: ":joy:",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f602/512.gif"
        },
        {
            text: ":screaming:",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f631/512.gif"
        },
        {
            text: ":hearted-eyes:",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f60d/512.gif"
        },
        {
            text: ":thinking-face:",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f914/512.gif"
        },
        {
            text: ":see-no-evil-monkeys:",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f648/512.gif"
        },
        {
            text: ":light-bulb:",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f4a1/512.gif"
        },
        {
            text: ":person-raising-hands:",
            icon: "https://img.icons8.com/emoji/96/person-raising-hand.png"
        },
        {
            text: ":thumbs-up:",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f44d/512.gif"
        },
        {
            text: ":wave:",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f44b/512.gif"
        },
        {
            text: ":okay:",
            icon: "https://img.icons8.com/emoji/96/ok-hand-emoji.png"
        },
        {
            text: ":fire:",
            color: "#D23A3F",
            dotColor: "#FF8D3E",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f603/512.gif",
        },
        {
            text: ":rofl:",
            color: "#5B99F0",
            dotColor: "#FFC441",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f62d/512.gif",
        },
        {
            text: ":heart:",
            color: "#8F4EEA",
            dotColor: "#FF393D",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f923/512.gif",
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
                                        <button className={styles.emojiBtn}>
                                            <img src={reaction.icon} data-key={reaction.text} height="30" />
                                        </button>
                                    </CustomGrid>
                                ))}
                            </ConditionalRender>

                            {/* <ActionButton
                                className={clsx(styles.actionButton, {
                                    [styles.disabled]: isAudience && !!!profile.id,
                                })}
                                Icon={<SendIcon width="24px" height="24px" />}
                                onClick={sendNote}
                            /> */}
                        </CustomGrid>
                    </CustomPaper>
                }
            </div>
        </ClickAwayListener>
    );
};

export const EmojiList = memo(Component);
