/* eslint-disable no-fallthrough */
import { Translation } from '@library/common/Translation/Translation';
import { SpeedDial, SpeedDialAction } from '@mui/material';
import { useStore } from 'effector-react';
import { memo } from 'react';
import { EllipsisIcon } from 'shared-frontend/icons/OtherIcons/EllipsisIcon';
import { GoodsIcon } from 'shared-frontend/icons/OtherIcons/GoodsIcon';
import { MonetizationIcon } from 'shared-frontend/icons/OtherIcons/MonetizationIcon';
import { SettingsIcon } from 'shared-frontend/icons/OtherIcons/SettingsIcon';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import {
    $isGoodsVisible,
    appDialogsApi,
    toggleIsGoodsVisible,
} from 'src/store';
import {
    $isMeetingHostStore,
    $isScreenSharingStore,
    $localUserStore,
    $meetingStore,
    $meetingTemplateStore,
    startScreenSharing,
    stopScreenSharing,
} from 'src/store/roomStores';
import { AppDialogsEnum } from 'src/store/types';
import styles from './MeetingControlCollapse.module.scss';
import { useBrowserDetect } from '@hooks/useBrowserDetect';
import { SharingIcon } from 'shared-frontend/icons/OtherIcons/SharingIcon';
import clsx from 'clsx';

enum CollapseTypes {
    Settings = 'settings',
    Payments = 'payments',
    GoodLinks = 'good_links',
    Sharing = 'sharing',
}

const Actions = [
    {
        icon: <SettingsIcon width="22px" height="22px" />,
        name: 'Settings',
        type: CollapseTypes.Settings,
    },
    {
        icon: <GoodsIcon width="22px" height="22px" className="" />,
        name: 'GoodLinks',
        type: CollapseTypes.GoodLinks,
    },
    {
        icon: <SharingIcon width="22px" height="22px" />,
        name: 'Sharing',
        type: CollapseTypes.Sharing,
    },
];

const Component = () => {
    const meetingTemplate = useStore($meetingTemplateStore);
    const isGoodsVisible = useStore($isGoodsVisible);
    const isMeetingHost = useStore($isMeetingHostStore);
    const localUser = useStore($localUserStore);
    const meeting = useStore($meetingStore);
    const isSharingActive = useStore($isScreenSharingStore);
    const { isMobile } = useBrowserDetect();
    const isSharingScreenActive = localUser.id === meeting.sharingUserId;
    const isAbleToToggleSharing =
        isMeetingHost || isSharingScreenActive || !meeting.sharingUserId;

    const handleToggleSharing = () => {
        if (!meeting.sharingUserId) {
            startScreenSharing();
        } else if (isMeetingHost || isSharingScreenActive) {
            stopScreenSharing();
        }
    };

    const handleActions = (action: string) => {
        switch (action) {
            case CollapseTypes.Settings:
                appDialogsApi.openDialog({
                    dialogKey: AppDialogsEnum.devicesSettingsDialog,
                });
                break;
            case CollapseTypes.GoodLinks:
                toggleIsGoodsVisible();
                break;
            case CollapseTypes.Sharing:
                if (isAbleToToggleSharing) {
                    handleToggleSharing();
                }
                break;
            default:
                break;
        }
    };

    const checkHideAction = (action: string) => {
        switch (action) {
            case CollapseTypes.Settings:
            case CollapseTypes.Sharing:
                return isMobile;
            case CollapseTypes.GoodLinks:
                return !meetingTemplate?.links?.length;
            default:
                return false;
        }
    };

    const getActiveButton = (action: string) => {
        switch (action) {
            case CollapseTypes.Sharing:
                return isSharingActive && isAbleToToggleSharing;
            default:
                return false;
        }
    };

    const getTooltip = (action: string) => {
        switch (action) {
            case CollapseTypes.Settings:
                return (
                    <Translation
                        nameSpace="meeting"
                        translation="settings.main"
                    />
                );

            case CollapseTypes.GoodLinks:
                return (
                    <Translation
                        nameSpace="meeting"
                        translation={
                            isGoodsVisible ? 'links.offGoods' : 'links.onGoods'
                        }
                    />
                );
            case CollapseTypes.Sharing: {
                let tooltip = '';
                if (isAbleToToggleSharing) {
                    tooltip = `modes.screensharing.${
                        isSharingActive ? 'off' : 'on'
                    }`;
                }
                if (!isAbleToToggleSharing && isSharingActive) {
                    tooltip = 'modes.screensharing.busy';
                }
                return (
                    <Translation nameSpace="meeting" translation={tooltip} />
                );
            }
            default:
                return '';
        }
    };

    const renderActions = () => {
        return Actions.map(item => {
            if (checkHideAction(item.type)) return null;
            const active = getActiveButton(item.type);
            return (
                <SpeedDialAction
                    key={item.name}
                    icon={item.icon}
                    tooltipTitle={getTooltip(item.type)}
                    onClick={() => handleActions(item.type)}
                    classes={{
                        fab: clsx(styles.root, { [styles.active]: active }),
                    }}
                />
            );
        });
    };

    return (
        <CustomGrid container className={styles.controlCollapse}>
            <SpeedDial
                ariaLabel="meeting-control-collapse"
                icon={<EllipsisIcon width="22px" height="22px" />}
                classes={{ root: styles.root, fab: styles.root }}
            >
                {renderActions()}
            </SpeedDial>
        </CustomGrid>
    );
};
export const MeetingControlCollapse = memo(Component);
