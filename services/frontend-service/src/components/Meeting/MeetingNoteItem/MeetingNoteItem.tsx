import React, { memo, useCallback, useMemo } from 'react';
import Draggable from 'react-draggable';
import clsx from 'clsx';
import { useStore } from 'effector-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import Linkify from 'linkify-react';

// hooks
import { useToggle } from 'shared-frontend/hooks/useToggle';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// icons
import { RoundCloseIcon } from 'shared-frontend/icons/RoundIcons/RoundCloseIcon';
import { CopyIcon } from 'shared-frontend/icons/OtherIcons/CopyIcon';

// types
import { MeetingNote, NotificationType } from '../../../store/types';

// styles
import styles from './MeetingNoteItem.module.scss';

// stores
import { addNotificationEvent } from '../../../store';
import {
    $isMeetingHostStore,
    $localUserStore,
    removeLocalMeetingNoteEvent,
    removeMeetingNoteSocketEvent,
} from '../../../store/roomStores';

const Component = ({
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
    const isMeetingHost = useStore($isMeetingHostStore);

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
                <ConditionalRender condition={isMeetingHost || isMeetingNoteOwner}>
                    <RoundCloseIcon
                        width="20px"
                        height="20px"
                        className={styles.unpinButton}
                        onClick={handleUnpinNote}
                    />
                </ConditionalRender>
            </CustomGrid>
        </Draggable>
    );
};

export const MeetingNoteItem = memo(Component);
