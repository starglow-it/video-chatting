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
    $isOwner,
    $meetingTemplateStore,
} from 'src/store/roomStores';
import { AppDialogsEnum } from 'src/store/types';
import styles from './MeetingControlCollapse.module.scss';

enum CollapseTypes {
    Settings = 'settings',
    Payments = 'payments',
    GoodLinks = 'good_links',
}

const Actions = [
    {
        icon: <SettingsIcon width="22px" height="22px" />,
        name: 'Settings',
        type: CollapseTypes.Settings,
    },
    {
        icon: <GoodsIcon width="22px" height="22px" />,
        name: 'GoodLinks',
        type: CollapseTypes.GoodLinks,
    },
];

const Component = () => {
    const isOwner = useStore($isOwner);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isGoodsVisible = useStore($isGoodsVisible);

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
            default:
                break;
        }
    };

    const checkHideAction = (action: string) => {
        switch (action) {
            case CollapseTypes.Settings:
                return !isOwner;
            case CollapseTypes.GoodLinks:
                return !meetingTemplate?.links?.length;
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
            default:
                return '';
        }
    };

    const renderActions = () => {
        return Actions.map(item => {
            if (checkHideAction(item.type)) return null;
            return (
                <SpeedDialAction
                    key={item.name}
                    icon={item.icon}
                    tooltipTitle={getTooltip(item.type)}
                    onClick={() => handleActions(item.type)}
                    classes={{ fab: styles.root }}
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
