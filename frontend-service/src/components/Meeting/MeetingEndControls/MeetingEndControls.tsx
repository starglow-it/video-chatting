import React, { memo, useCallback } from 'react';
import { useRouter } from 'next/router';

// components
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { HangUpIcon } from '@library/icons/HangUpIcon';

// stores
import { appDialogsApi } from '../../../store/dialogs';
import { AppDialogsEnum } from '../../../store/types';

import styles from './MeetingEndControls.module.scss';

const MeetingEndControls = memo(() => {
    const router = useRouter();

    const isEditTemplateView = router.pathname.includes('edit-template');

    const handleEndVideoChat = useCallback(() => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.endMeetingDialog,
        });
    }, []);

    return (
        <ActionButton
            variant="danger"
            onAction={!isEditTemplateView ? handleEndVideoChat : undefined}
            className={styles.hangUpButton}
            Icon={<HangUpIcon width="32px" height="32px" />}
        />
    );
});

export { MeetingEndControls };
