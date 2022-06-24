import React, { memo, useCallback, useMemo } from 'react';
import Draggable from 'react-draggable';
import clsx from 'clsx';
import { useStore } from 'effector-react';

// hooks

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { RoundCloseIcon } from '@library/icons/RoundIcons/RoundCloseIcon';
import { useToggle } from '../../../hooks/useToggle';

// types
import { MeetingNote } from '../../../store/types';

// styles
import styles from './MeetingNoteItem.module.scss';

// stores
import {
    removeLocalMeetingNoteEvent,
    removeMeetingNoteSocketEvent,
} from '../../../store';
import { $localUserStore } from '../../../store';
import { $meetingStore } from '../../../store';

const MeetingNoteItem = memo(
    ({
        noteIndex,
        lineNumber,
        note,
        onSetLastDragged,
        dragIndex,
    }: {
        noteIndex: number;
        lineNumber: number;
        note: MeetingNote;
        onSetLastDragged: (id: string) => void;
        dragIndex: number;
    }) => {
        const localUser = useStore($localUserStore);
        const meeting = useStore($meetingStore);

        const isOwner = meeting.ownerProfileId === localUser.profileId;

        const yPosition = 250 + noteIndex * 124 + 20 * noteIndex;

        const {
            value: isDragging,
            onSwitchOn: handleOnDragging,
            onSwitchOff: handleOffDragging,
        } = useToggle(false);

        const handleStart = useCallback(() => {
            handleOnDragging();
            onSetLastDragged(note.id);
        }, []);

        const handleStop = useCallback(() => {
            handleOffDragging();
        }, []);

        const defaultPosition = useMemo(
            () => ({
                x: 20 + lineNumber * 224 + 20 * lineNumber,
                y: yPosition,
            }),
            [],
        );

        const handleUnpinNote = useCallback(() => {
            removeLocalMeetingNoteEvent(note.id);
            removeMeetingNoteSocketEvent({ noteId: note.id });
        }, [note.id]);

        return (
            <Draggable
                axis="both"
                defaultPosition={defaultPosition}
                onStart={handleStart}
                onStop={handleStop}
            >
                <CustomGrid
                    container
                    className={clsx(styles.noteWrapper, { [styles.withSticker]: !isDragging })}
                    style={{ zIndex: dragIndex * 10 }}
                >
                    <CustomScroll className={styles.scroll}>
                        <CustomGrid container className={styles.content}>
                            <CustomTypography className={styles.text}>
                                {note.content}
                            </CustomTypography>
                        </CustomGrid>
                    </CustomScroll>
                    {isOwner && (
                        <RoundCloseIcon
                            width="20px"
                            height="20px"
                            className={styles.unpinButton}
                            onClick={handleUnpinNote}
                        />
                    )}
                </CustomGrid>
            </Draggable>
        );
    },
);

export { MeetingNoteItem };
