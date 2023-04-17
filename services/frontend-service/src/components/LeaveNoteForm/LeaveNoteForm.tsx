import React, { memo, useCallback, useState } from 'react';
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
import { MAX_NOTE_CONTENT } from '../../const/general';

// validation
import { simpleStringSchemaWithLength } from '../../validation/common';

// stores
import { sendMeetingNoteSocketEvent } from '../../store/roomStores';

// styles
import styles from './LeaveNoteForm.module.scss';
import { ClickAwayListener } from '@mui/material';
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

    const resolver = useYupValidationResolver<FormType>(validationSchema);

    const methods = useForm({
        resolver,
        defaultValues: { note: '' },
    });

    const { reset, register, getValues } = methods;

    const [isExpand, setIsExpand] = useState<boolean>(true);

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter' || e.keyCode === '13') {
            sendMeetingNoteSocketEvent(getValues());
            reset();
        }
    };

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

    const changeExpand = () => {
        setIsExpand(!isExpand);
    };

    return (
        <ClickAwayListener onClickAway={() => setIsExpand(false)}>
            <FormProvider {...methods}>
                <CustomPaper
                    className={clsx(styles.commonOpenPanel, {
                        [styles.expanded]: isExpand,
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
                            className={clsx(styles.actionButton)}
                            Icon={<NotesIcon width="35px" height="35px" />}
                            onClick={changeExpand}
                        />
                        <ConditionalRender condition={isExpand}>
                            <CustomInput
                                nameSpace="meeting"
                                translation="features.notes.input"
                                className={materialStyles.textField}
                                onKeyDown={handleKeyDown}
                                {...restRegisterData}
                                onChange={handleChange}
                                InputLabelProps={{
                                    style: {
                                        height: '40px',
                                    },
                                }}
                                inputProps={{
                                    style: {
                                        height: '40px',
                                        padding: 0,
                                    },
                                }}
                            />
                        </ConditionalRender>
                    </CustomGrid>
                </CustomPaper>
            </FormProvider>
        </ClickAwayListener>
    );
};

export const LeaveNoteForm = memo(Component);
