import { memo, useCallback, useState } from 'react';
import * as yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { Theme } from '@mui/system';
import createStyles from '@mui/styles/createStyles';
import { makeStyles } from '@mui/styles';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';

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
import { NotesIcon } from 'shared-frontend/icons/OtherIcons/NotesIcon';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { useBrowserDetect } from '@hooks/useBrowserDetect';
import { useStore } from 'effector-react';
import { $profileStore, addNotificationEvent } from 'src/store';
import { NotificationType } from 'src/store/types';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import styles from './LeaveNoteForm.module.scss';
import {
    $isLurker,
    $meetingNotesStore,
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
                    color: theme.palette.colors.white.primary,
                },
            },
            '& .MuiOutlinedInput-root': {
                background: 'transparent',
                color: theme.palette.colors.white.primary,
                '&.Mui-focused, &:hover': {
                    color: theme.palette.colors.white.primary,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.colors.white.primary,
                    },
                },
                height: '35px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.colors.white.primary,
                borderRadius: '8px',
            },
            '& .MuiFormLabel-root': {
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
    const isLurker = useStore($isLurker);
    const profile = useStore($profileStore);
    const resolver = useYupValidationResolver<FormType>(validationSchema);

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

    const changeExpand = () => {
        setIsExpand(!isExpand);
    };

    return (
        <ClickAwayListener onClickAway={() => setIsExpand(false)}>
            <div>
                <FormProvider {...methods}>
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
                            <ActionButton
                                className={clsx(styles.actionButton, {
                                    [styles.disabled]: isLurker && !!!profile.id,
                                })}
                                Icon={<NotesIcon width="32px" height="32px" />}
                                onClick={changeExpand}
                            />

                            <CustomGrid flex={1}>
                                <ConditionalRender
                                    condition={!isLurker || !!profile.id}
                                >
                                    <CustomInput
                                        nameSpace="meeting"
                                        translation="features.notes.input"
                                        className={clsx(
                                            materialStyles.textField,
                                            styles.textField,
                                            { [styles.expanded]: isExpand },
                                        )}
                                        onKeyDown={handleKeyDown}
                                        {...restRegisterData}
                                        onChange={handleChange}
                                    />
                                </ConditionalRender>
                                <ConditionalRender
                                    condition={isLurker && !!!profile.id}
                                >
                                    <CustomGrid
                                        className={styles.fieldNoLogin}
                                        display="flex"
                                        alignItems="center"
                                    >
                                        <span>
                                            <a
                                                href={`${config.frontendUrl}/register`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Join
                                            </a>{' '}
                                            to Post a Sticky Note
                                        </span>
                                    </CustomGrid>
                                </ConditionalRender>
                            </CustomGrid>
                        </CustomGrid>
                    </CustomPaper>
                </FormProvider>
            </div>
        </ClickAwayListener>
    );
};

export const LeaveNoteForm = memo(Component);
