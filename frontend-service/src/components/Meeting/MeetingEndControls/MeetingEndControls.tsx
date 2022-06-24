import React, { memo, useCallback } from 'react';

// components
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { HangUpIcon } from '@library/icons/HangUpIcon';

// stores
import { appDialogsApi } from '../../../store';
import { AppDialogsEnum } from '../../../store/types';

import styles from './MeetingEndControls.module.scss';

const MeetingEndControls = memo(() => {
    const handleEndVideoChat = useCallback(() => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.endMeetingDialog,
        });
    }, []);

    return (
        <ActionButton
            variant="danger"
            onAction={handleEndVideoChat}
            className={styles.hangUpButton}
            Icon={<HangUpIcon width="32px" height="32px" />}
        />
    );
});

export { MeetingEndControls };
