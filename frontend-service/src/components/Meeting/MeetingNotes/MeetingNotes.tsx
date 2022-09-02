import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from 'effector-react';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { MeetingNoteItem } from '@components/Meeting/MeetingNoteItem/MeetingNoteItem';

// stores
import {
    $meetingNotesStore,
    $windowSizeStore,
    getMeetingNotesSocketEvent,
    resetMeetingNotesEvent,
} from '../../../store';

// styles
import styles from './MeetingNotes.module.scss';

// utils
import { isMobile } from '../../../utils/browser/detectBrowser';

const MeetingNotes = memo(() => {
    const meetingNotes = useStore($meetingNotesStore);
    const { height } = useStore($windowSizeStore);

    const [lastDraggedSet, setLastDraggedSet] = useState([]);

    useEffect(() => {
        if (!isMobile()) getMeetingNotesSocketEvent();

        return () => {
            resetMeetingNotesEvent();
        };
    }, []);

    const handleSetLastDraggedId = useCallback(id => {
        setLastDraggedSet(prev => [...prev.filter(oldId => oldId !== id), id]);
    }, []);

    const renderMeetingNotes = useMemo(() => {
        const spreadNotesInGrid = meetingNotes.reduce(
            (acc, b) => {
                const currentLineData = acc[acc.length - 1];
                const currentElementsNumber = currentLineData.length;

                const currentHeight = 250 + currentElementsNumber * (124 + 20);

                if (currentHeight + 124 < height) {
                    currentLineData.push(b);

                    return acc;
                }
                return [...acc, [b]];
            },
            [[]],
        );

        return spreadNotesInGrid.map((elementsData, i) =>
            elementsData.map((note, n) => {
                const dragIndex = [...lastDraggedSet].findIndex(noteId => noteId === note.id);

                return (
                    <MeetingNoteItem
                        key={note.id}
                        note={note}
                        noteIndex={n}
                        lineNumber={i}
                        dragIndex={dragIndex}
                        onSetLastDragged={handleSetLastDraggedId}
                    />
                );
            }),
        );
    }, [meetingNotes, lastDraggedSet]);

    return <CustomGrid className={styles.notesWrapper}>{renderMeetingNotes}</CustomGrid>;
});

export { MeetingNotes };
