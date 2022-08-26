import React, { memo, useCallback } from 'react';
import * as yup from 'yup';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useStore } from 'effector-react';
import { Theme } from '@mui/system';
import createStyles from '@mui/styles/createStyles';
import { makeStyles } from '@mui/styles';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';

// components
import { AcceptIcon } from '@library/icons/AcceptIcon';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { DeleteIcon } from '@library/icons/DeleteIcon';

// const
import { MAX_NOTE_CONTENT } from '../../const/general';

// validation
import { simpleStringSchemaWithLength } from '../../validation/common';

// stores
import { sendMeetingNoteSocketEvent } from '../../store';

// styles
import styles from './LeaveNoteForm.module.scss';

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

const Component = ({ onCancel }: { onCancel: () => void }) => {
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

    const onSubmit = useCallback(
        handleSubmit(async data => {
            sendMeetingNoteSocketEvent(data);
            reset();
            onCancel();
        }),
        [],
    );

    const handleCancelLeaveNote = useCallback(() => {
        console.log('cancel');
        reset();
        onCancel();
    }, []);

    const { onChange, ...restRegisterData } = register('note', { maxLength: MAX_NOTE_CONTENT });

    const handleChange = useCallback(async event => {
        if (event.target.value.length > MAX_NOTE_CONTENT) {
            /* eslint-disable no-param-reassign */
            event.target.value = event.target.value.slice(0, MAX_NOTE_CONTENT);
            /* eslint-enable no-param-reassign */
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
                        disabled={isSendNotePending}
                        className={styles.submitNote}
                        Icon={<AcceptIcon width="23px" height="23px" />}
                    />
                    <ActionButton
                        variant="decline"
                        onAction={handleCancelLeaveNote}
                        disabled={isSendNotePending}
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
};

export const LeaveNoteForm = memo(Component);
