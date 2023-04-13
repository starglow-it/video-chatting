import React, { memo, useCallback, useState } from 'react';
import * as yup from 'yup';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useStore } from 'effector-react';
import { Theme } from '@mui/system';
import createStyles from '@mui/styles/createStyles';
import { makeStyles } from '@mui/styles';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { AcceptIcon } from 'shared-frontend/icons/OtherIcons/AcceptIcon';
import { DeleteIcon } from 'shared-frontend/icons/OtherIcons/DeleteIcon';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';

// components
import { ActionButton } from 'shared-frontend/library/common/ActionButton';

// const
import { MAX_NOTE_CONTENT } from '../../const/general';

// validation
import { simpleStringSchemaWithLength } from '../../validation/common';

// stores
import { sendMeetingNoteSocketEvent } from '../../store/roomStores';

// styles
import styles from './LeaveNoteForm.module.scss';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    ClickAwayListener,
} from '@mui/material';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import clsx from 'clsx';
import { NotesIcon } from 'shared-frontend/icons/OtherIcons/NotesIcon';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

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
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.colors.white.primary,
            },
        },
    }),
);

type FormType = { note: string };

const Component = () => {
    const materialStyles = useStyles();

    const isSendNotePending = useStore(sendMeetingNoteSocketEvent.pending);

    const resolver = useYupValidationResolver<FormType>(validationSchema);

    const methods = useForm({
        resolver,
        defaultValues: { note: '' },
    });

    const { handleSubmit, control, reset, register } = methods;

    const noteText = useWatch({
        control,
        name: 'note',
    });

    const [isExpand, setIsExpand] = useState<boolean>(false);

    const onSubmit = useCallback(
        handleSubmit(async data => {
            sendMeetingNoteSocketEvent(data);
            reset();
        }),
        [],
    );

    const { onChange, ...restRegisterData } = register('note', {
        maxLength: MAX_NOTE_CONTENT,
    });

    const handleChange = useCallback(async event => {
        if (event.target.value.length > MAX_NOTE_CONTENT) {
            /* eslint-disable no-param-reassign */
            event.target.value = event.target.value.slice(0, MAX_NOTE_CONTENT);
            /* eslint-enable no-param-reassign */
        }

        await onChange(event);
    }, []);

    const changeExpand = (event: React.SyntheticEvent, expanded: boolean) => {
        setIsExpand(expanded);
    };

    return (
        <ClickAwayListener onClickAway={() => setIsExpand(false)}>
            <CustomPaper
                // variant="black-glass"
                className={clsx(styles.commonOpenPanel, {
                    [styles.expanded]: isExpand,
                })}
            >
                <FormProvider {...methods}>
                    <Accordion
                        style={{ background: 'transparent' }}
                        expanded={isExpand}
                        onChange={changeExpand}
                        className={clsx(styles.accordion)}
                        TransitionProps={{
                            timeout: {
                                appear: 600,
                                enter: 800,
                                exit: 300,
                            },
                        }}
                    >
                        <AccordionSummary
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            className={styles.summary}
                            classes={{ content: styles.content }}
                        >
                            <CustomGrid container alignItems="center">
                                <ActionButton
                                    // onAction={handleToggleLeaveNote}
                                    className={clsx(
                                        styles.actionButton
                                    )}
                                    Icon={
                                        <NotesIcon width="30px" height="30px" />
                                    }
                                />
                                <ConditionalRender condition={isExpand}>
                                    <CustomTypography
                                        color="colors.white.primary"
                                        variant="h4bold"
                                        nameSpace="meeting"
                                        translation="features.notes.title"
                                        fontSize={16}
                                    />
                                    <CustomTypography
                                        className={styles.textLength}
                                        color="colors.white.primary"
                                        fontSize={14}
                                    >
                                        {`${noteText.length}/${MAX_NOTE_CONTENT}`}
                                    </CustomTypography>
                                    <ActionButton
                                        onAction={onSubmit}
                                        variant="accept"
                                        disabled={isSendNotePending}
                                        className={styles.submitNote}
                                        Icon={
                                            <AcceptIcon
                                                width="23px"
                                                height="23px"
                                            />
                                        }
                                    />
                                </ConditionalRender>
                            </CustomGrid>
                        </AccordionSummary>
                        <AccordionDetails>
                            <CustomInput
                                nameSpace="meeting"
                                translation="features.notes.input"
                                multiline
                                rows={3}
                                className={materialStyles.textField}
                                {...restRegisterData}
                                onChange={handleChange}
                            />
                        </AccordionDetails>
                    </Accordion>
                </FormProvider>
            </CustomPaper>
        </ClickAwayListener>
    );
};

export const LeaveNoteForm = memo(Component);
