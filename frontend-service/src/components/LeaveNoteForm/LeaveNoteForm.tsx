import React, { memo, useCallback } from 'react';
import * as yup from 'yup';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

// styles

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';

// components
import { AcceptIcon } from '@library/icons/AcceptIcon';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { DeleteIcon } from '@library/icons/DeleteIcon';

// const
import createStyles from '@mui/styles/createStyles';
import { Theme } from '@mui/system';
import { makeStyles } from '@mui/styles';
import { MAX_NOTE_CONTENT } from '../../const/general';

// validation
import { simpleStringSchemaWithLength } from '../../validation/common';
import { useYupValidationResolver } from '../../hooks/useYupValidationResolver';

// stores
import { sendMeetingNoteSocketEvent } from '../../store';

import styles from './LeaveNoteForm.module.scss';

const validationSchema = yup.object({
    note: simpleStringSchemaWithLength(MAX_NOTE_CONTENT).required('required'),
});

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                    color: 'white',
                    // color: theme.palette.colors.white.primary,
                },
            },
            '& .MuiOutlinedInput-root': {
                background: 'transparent',
                // color: theme.palette.colors.white.primary,
                color: 'white',
                '&.Mui-focused, &:hover': {
                    color: 'white',
                    // color: theme.palette.colors.white.primary,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                        // borderColor: theme.palette.colors.white.primary
                    },
                },
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
                // borderColor: theme.palette.colors.white.primary
            },
        },
    }),
);

const LeaveNoteForm = memo(({ onCancel }: { onCancel: () => void }) => {
    const materialStyles = useStyles();

    const resolver = useYupValidationResolver<{ note: string }>(validationSchema);

    const methods = useForm({
        resolver,
        defaultValues: { note: '' },
    });

    const { handleSubmit, control, reset, register } = methods;

    const noteText = useWatch({
        control,
        name: 'note',
    });

    const onSubmit = useCallback(
        handleSubmit(data => {
            sendMeetingNoteSocketEvent(data);
            reset();
            onCancel();
        }),
        [],
    );

    const handleCancelLeaveNote = useCallback(() => {
        reset();
        onCancel();
    }, []);

    const { onChange, ...restRegisterData } = register('note', { maxLength: MAX_NOTE_CONTENT });

    const handleChange = useCallback(async event => {
        if (event.target.value.length > MAX_NOTE_CONTENT) {
            event.target.value = event.target.value.slice(0, MAX_NOTE_CONTENT);
        }

        await onChange(event);
    }, []);

    return (
        <FormProvider {...methods}>
            <CustomGrid container direction="column" gap={2.5}>
                <CustomGrid container alignItems="center">
                    <CustomTypography
                        color="colors.white.primary"
                        variant="h4bold"
                        nameSpace="meeting"
                        translation="features.notes.title"
                    />
                    <CustomTypography className={styles.textLength} color="colors.white.primary">
                        {`${noteText.length}/${MAX_NOTE_CONTENT}`}
                    </CustomTypography>
                    <ActionButton
                        onAction={onSubmit}
                        variant="accept"
                        className={styles.submitNote}
                        Icon={<AcceptIcon width="23px" height="23px" />}
                    />
                    <ActionButton
                        variant="decline"
                        onAction={handleCancelLeaveNote}
                        className={styles.cancelNote}
                        Icon={<DeleteIcon width="23px" height="23px" />}
                    />
                </CustomGrid>
                <CustomInput
                    nameSpace="meeting"
                    translation="features.notes.input"
                    multiline
                    rows={4}
                    className={materialStyles.textField}
                    {...restRegisterData}
                    onChange={handleChange}
                />
            </CustomGrid>
        </FormProvider>
    );
});

export { LeaveNoteForm };
