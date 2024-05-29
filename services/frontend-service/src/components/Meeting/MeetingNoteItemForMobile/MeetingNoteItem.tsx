import { memo, useCallback, useEffect, useMemo } from 'react';
import Draggable from 'react-draggable';
import clsx from 'clsx';
import { useStore, useStoreMap } from 'effector-react';
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
// import { useTimer } from '@hooks/useTimer';
// import { MAX_MILLISECOND_BLUR_NOTE } from 'src/const/time/common';

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
    $meetingUsersStore,
    $isAudience,
    removeLocalMeetingNoteEvent,
    removeMeetingNoteSocketEvent,
} from '../../../store/roomStores';

const Component = ({
    noteIndex,
    note,
    onSetLastDragged,
    dragIndex,
}: {
    noteIndex: number;
    note: MeetingNote;
    onSetLastDragged: (id: string) => void;
    dragIndex: number;
}) => {
    const localUser = useStore($localUserStore);
    const isMeetingHost = useStore($isMeetingHostStore);
    const isAudience = useStore($isAudience);

    const user = useStoreMap({
        store: $meetingUsersStore,
        keys: [note.user],
        fn: (state, [userId]) => state.find(item => item.id === userId),
    });

    const isMeetingNoteOwner = localUser.id === note.user;
    const backgrounds = ['#F8F49F', '#9FE8F8', '#F1CAE3'];

    const handleUnpinNote = useCallback(() => {
        if (!isAudience) {
            removeLocalMeetingNoteEvent(note.id);
            removeMeetingNoteSocketEvent({ noteId: note.id });
        }
    }, [note.id]);

    return (
        <CustomGrid
            container
            className={clsx(styles.noteWrapper)}
            sx={{ background: backgrounds[noteIndex] || backgrounds[0] }}
        >
            <CustomScroll className={styles.scroll}>
                <CustomGrid container className={styles.content}>
                    <CustomTypography className={styles.text}>
                        {note.content}
                    </CustomTypography>
                </CustomGrid>
            </CustomScroll>
            <CustomGrid
                display="flex"
                flexDirection="row"
                justifyContent="flex-end"
                width="100%"
                padding={1}
            >
                <CustomTypography variant="subtitle2" color="#c17e7e">
                    {user?.username}
                </CustomTypography>
            </CustomGrid>
            <ConditionalRender
                condition={isMeetingHost || isMeetingNoteOwner}
            >
                <RoundCloseIcon
                    width="20px"
                    height="20px"
                    className={styles.unpinButton}
                    onClick={handleUnpinNote}
                />
            </ConditionalRender>
        </CustomGrid>
    );
};

export const MeetingNoteItem = memo(Component);
