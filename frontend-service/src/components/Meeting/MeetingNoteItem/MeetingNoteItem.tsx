import React, { memo, useCallback, useMemo } from 'react';
import Draggable from 'react-draggable';
import clsx from 'clsx';
import { useStore } from 'effector-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import Linkify from 'linkify-react';

// hooks
import { useToggle } from '@hooks/useToggle';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// icons
import { RoundCloseIcon } from '@library/icons/RoundIcons/RoundCloseIcon';
import { CopyIcon } from '@library/icons/CopyIcon';

// types
import { MeetingNote, NotificationType } from '../../../store/types';

// styles
import styles from './MeetingNoteItem.module.scss';

// stores
import {
    $isOwner,
    addNotificationEvent,
    removeLocalMeetingNoteEvent,
    removeMeetingNoteSocketEvent,
    $localUserStore,
} from '../../../store';

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
        const isOwner = useStore($isOwner);

        const isMeetingNoteOwner = localUser.id === note.user;

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

        const handleTextCopied = () => {
            addNotificationEvent({
                type: NotificationType.copyNotification,
                message: 'meeting.copy.notification',
            });
        };

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
                    <CopyToClipboard text={note.content} onCopy={handleTextCopied}>
                        <CustomBox className={styles.copyIcon}>
                            <CopyIcon width="18px" height="18px" />
                        </CustomBox>
                    </CopyToClipboard>
                    <CustomScroll className={styles.scroll}>
                        <CustomGrid container className={styles.content}>
                            <CustomTypography className={styles.text}>
                                <Linkify
                                    options={{
                                        target: '_blank',
                                    }}
                                >
                                    {note.content}
                                </Linkify>
                            </CustomTypography>
                        </CustomGrid>
                    </CustomScroll>
                    {(isOwner || isMeetingNoteOwner) && (
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
