import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import clsx from 'clsx';
import { MicIcon } from 'shared-frontend/icons/OtherIcons/MicIcon';
import { HangUpIcon } from 'shared-frontend/icons/OtherIcons/HangUpIcon';
import { PersonPlusIcon } from 'shared-frontend/icons/OtherIcons/PersonPlusIcon';
import { ChatIcon } from 'shared-frontend/icons/OtherIcons/ChatIcon';
import { MonetizationIcon } from 'shared-frontend/icons/OtherIcons/MonetizationIcon';
import styles from './MeetingBottomBarMobile.module.scss';
import { SyntheticEvent } from 'react';
import {
    $isHaveNewMessage,
    $isMeetingHostStore,
    $isToggleUsersPanel,
    $meetingUsersStore,
    togglePaymentFormEvent,
    toggleSchedulePanelEvent,
    toggleUsersPanelEvent,
} from 'src/store/roomStores';
import { useStore, useStoreMap } from 'effector-react';
import { MeetingAccessStatusEnum } from 'shared-types';
import { useBrowserDetect } from '@hooks/useBrowserDetect';
import { ImageIcon } from 'shared-frontend/icons/OtherIcons/ImageIcon';

export const MeetingBottomBarMobile = () => {
    const isUsersOpen = useStore($isToggleUsersPanel);
    const isThereNewRequests = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state =>
            state.some(
                user =>
                    user.accessStatus === MeetingAccessStatusEnum.RequestSent ||
                    user.accessStatus ===
                        MeetingAccessStatusEnum.SwitchRoleSent,
            ),
    });
    const isThereNewMessage = useStore($isHaveNewMessage);
    const isMeetingHost = useStore($isMeetingHostStore);

    const { isMobile } = useBrowserDetect();

    const handleToggleSchedulePanel = (e: SyntheticEvent) => {
        e.stopPropagation();
        toggleSchedulePanelEvent();
    };

    const handleToggleUsersPanel = (e: SyntheticEvent) => {
        e.stopPropagation();
        toggleUsersPanelEvent();
    };

    const handleTogglePaymentPanel = (e: SyntheticEvent) => {
        e.stopPropagation();
        togglePaymentFormEvent();
    };
    return (
        <CustomGrid className={styles.container}>
            <CustomGrid className={styles.main}>
                <CustomPaper
                    variant="black-glass"
                    borderRadius={28}
                    className={styles.deviceButton}
                >
                    <ActionButton
                        variant="transparentBlack"
                        // onAction={handleToggleMic}
                        className={clsx(styles.deviceButton, {
                            [styles.inactive]: false,
                        })}
                        Icon={<ImageIcon width="20px" height="20px" />}
                    />
                </CustomPaper>
                <CustomPaper
                    variant="black-glass"
                    borderRadius={28}
                    className={styles.deviceButton}
                >
                    <ActionButton
                        variant="transparentBlack"
                        onAction={handleToggleSchedulePanel}
                        className={clsx(styles.deviceButton)}
                        Icon={<PersonPlusIcon width="18px" height="18px" />}
                    />
                </CustomPaper>
                <ActionButton
                    variant="danger"
                    // onAction={handleEndVideoChat}
                    className={styles.endButton}
                    Icon={<HangUpIcon width="22px" height="22px" />}
                />
                <CustomPaper
                    variant="black-glass"
                    borderRadius={28}
                    className={styles.deviceButton}
                >
                    <ActionButton
                        variant="transparentBlack"
                        onAction={handleToggleUsersPanel}
                        className={clsx(styles.deviceButton, {
                            [styles.active]: isUsersOpen,
                            [styles.newRequests]:
                                (isThereNewRequests && isMeetingHost) ||
                                !!isThereNewMessage,
                            [styles.mobile]: isMobile,
                        })}
                        Icon={<ChatIcon width="18px" height="18px" />}
                    />
                </CustomPaper>
                <CustomPaper
                    variant="black-glass"
                    borderRadius={28}
                    className={styles.deviceButton}
                >
                    <ActionButton
                        variant="transparentBlack"
                        onAction={handleTogglePaymentPanel}
                        className={clsx(styles.deviceButton)}
                        Icon={<MonetizationIcon width="24px" height="24px" />}
                    />
                </CustomPaper>
            </CustomGrid>
        </CustomGrid>
    );
};
