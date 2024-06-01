import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';
import { FormProvider, useForm } from 'react-hook-form';
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';
import * as yup from 'yup';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { MeetingNoteItem } from '@components/Meeting/MeetingNoteItemForMobile/MeetingNoteItem';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

//icons
import { SendIcon } from 'shared-frontend/icons/OtherIcons/SendIcon';

//@mui
import { Theme } from '@mui/system';
import createStyles from '@mui/styles/createStyles';
import { makeStyles } from '@mui/styles';

// stores
import { NotificationType } from 'src/store/types';
import { $profileStore, addNotificationEvent } from '../../../store';
import {
    $meetingNotesStore,
    $meetingPanelsVisibilityForMobileStore,
    initialMeetingPanelsVisibilityData,
    getMeetingNotesSocketEvent,
    setMeetingPanelsVisibilityForMobileEvent,
    sendMeetingNoteSocketEvent
} from '../../../store/roomStores';

//type
type FormType = { note: string };

//const
import { simpleStringSchemaWithLength } from '../../../validation/common';
import { MAX_NOTE_CONTENT } from '../../../const/general';

// validation
const validationSchema = yup.object({
    note: simpleStringSchemaWithLength(MAX_NOTE_CONTENT).required('required'),
});

//hooks
import { useBrowserDetect } from 'shared-frontend/hooks/useBrowserDetect';

// styles
import styles from './MeetingNotes.module.scss';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

//@mui styles
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                    color: 'black',
                },
            },
            '& .MuiOutlinedInput-root': {
                background: 'white',
                color: 'black',
                '&.Mui-focused, &:hover': {
                    color: 'black',
                },
                height: '39px',
                fontSize: '18px'
            },
            '& .MuiOutlinedInput-input': {
                padding: '5px 14px'
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '3px',
                border: 'none'
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

// utils

const Component = () => {
    const meetingNotes = useStore($meetingNotesStore);
    const profile = useStore($profileStore);
    const { isMobileStickyNotesVisible } = useStore($meetingPanelsVisibilityForMobileStore);
    const resolver = useYupValidationResolver<FormType>(validationSchema);

    const [lastDraggedSet, setLastDraggedSet] = useState<string[]>([]);
    const [isExpand, setIsExpand] = useState<boolean>(true);
    const { isMobile } = useBrowserDetect();

    useEffect(() => {
        if (isMobile) {
            getMeetingNotesSocketEvent();
        }
    }, [isMobile]);

    const handleSetLastDraggedId = useCallback((id: string) => {
        setLastDraggedSet(prev => [...prev.filter(oldId => oldId !== id), id]);
    }, []);

    const methods = useForm({
        resolver,
        defaultValues: { note: '' },
    });

    const { reset, register, getValues, setValue } = methods;

    const { onChange, ...restRegisterData } = register('note', {
        maxLength: MAX_NOTE_CONTENT,
    });

    const materialStyles = useStyles();

    const renderMeetingNotes = useMemo(() => {
        if (meetingNotes.length) {
            return meetingNotes.map((note: any, index: number) => {
                const dragIndex = [...lastDraggedSet].findIndex(
                    noteId => noteId === note.id,
                );

                return (
                    <MeetingNoteItem
                        key={note.id}
                        note={note}
                        noteIndex={index}
                        dragIndex={dragIndex}
                        onSetLastDragged={handleSetLastDraggedId}
                    />
                );
            });
        } else return null;
    }, [meetingNotes, lastDraggedSet]);

    const handleCloseMeetingNotesPanel = useCallback(
        (e: MouseEvent | TouchEvent) => {
            e.stopPropagation();
            if (isMobileStickyNotesVisible) {
                setMeetingPanelsVisibilityForMobileEvent({
                    ...initialMeetingPanelsVisibilityData,
                    isMobileStickyNotesVisible: false
                });
            }
        },
        [isMobileStickyNotesVisible],
    );

    const handleChange = useCallback(async (event: any) => {
        if (event.target.value.length > MAX_NOTE_CONTENT) {
            /* eslint-disable no-param-reassign */
            event.target.value = event.target.value.slice(0, MAX_NOTE_CONTENT);
            /* eslint-enable no-param-reassign */
        }

        await onChange(event);
    }, []);

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

    return (
        <CustomGrid className={styles.notesWrapper}>
            <CustomTypography
                variant="body1bold"
                color="white"
                nameSpace="meeting"
                translation="stickyNotes.title"
            />
            <IconButton className={styles.closeIconBtn} onClick={handleCloseMeetingNotesPanel}>
                <CloseIcon className={styles.closeIcon} />
            </IconButton>
            <CustomGrid
                container
                justifyContent="flex-start"
                flexDirection="column"
                className={styles.notesItemWrapper}
                gap={3}
            >
                {renderMeetingNotes}
            </CustomGrid>
            <CustomBox className={styles.addNoteWrapper}>
                <FormProvider {...methods}>
                    <CustomGrid
                        container
                        alignItems="center"
                        flexDirection="row"
                        justifyContent="center"
                    >
                        <CustomGrid flex={1}>
                            <ConditionalRender
                                condition={!!profile.id}
                            >
                                <CustomInput
                                    placeholder="post a sticky note"
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
                        </CustomGrid>
                        <ActionButton
                            className={styles.sendButton}
                            Icon={<SendIcon width='22px' height='22px' />}
                            onClick={sendNote}
                        />
                    </CustomGrid>
                </FormProvider>
            </CustomBox>
        </CustomGrid>
    );
};

export const MeetingNotesForMobile = memo(Component);
