import React, {memo, useCallback, useMemo} from 'react';
import Draggable from "react-draggable";
import clsx from "clsx";

import {CustomGrid} from "@library/custom/CustomGrid/CustomGrid";
import {CustomScroll} from "@library/custom/CustomScroll/CustomScroll";

import {useToggle} from "../../../hooks/useToggle";
import {MeetingNote} from "../../../store/types";

import styles from "./MeetingNoteItem.module.scss";

const MeetingNoteItem = memo(({ noteIndex, lineNumber, note, onSetLastDragged, dragIndex }: { noteIndex: number; lineNumber: number; note: MeetingNote; onSetLastDragged: (id: string) => void; dragIndex: number }) => {
    const yPosition = 100 + noteIndex * (124) + 20 * noteIndex;

    const {
        value: isDragging,
        onSwitchOn: handleOnDragging,
        onSwitchOff: handleOffDragging
    } = useToggle(false);

    const handleStart = useCallback(() => {
        handleOnDragging();
        onSetLastDragged(note.id);
    }, []);

    const handleStop = useCallback(() => {
        handleOffDragging();
    }, []);

    const defaultPosition = useMemo(() => {
        return {
            x: 20 + (lineNumber * 224) + 20 * lineNumber,
            y: yPosition
        };
    }, []);

    return (
        <Draggable
            axis="both"
            defaultPosition={defaultPosition}
            onStart={handleStart}
            onStop={handleStop}
        >
            <CustomGrid container className={clsx(styles.noteWrapper, {[styles.withSticker]: !isDragging })} style={{ zIndex: dragIndex * 10 }}>
                <CustomScroll className={styles.scroll}>
                    <CustomGrid className={styles.content}>
                        {note.content}
                    </CustomGrid>
                </CustomScroll>
            </CustomGrid>
        </Draggable>
    )
});

export {MeetingNoteItem};