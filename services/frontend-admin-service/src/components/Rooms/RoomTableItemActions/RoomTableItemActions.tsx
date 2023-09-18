import React, { memo, useCallback, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { useStoreMap } from 'effector-react';
import Router from 'next/router';

import { useToggle } from 'shared-frontend/hooks/useToggle';

// components
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { EllipsisIcon } from 'shared-frontend/icons/OtherIcons/EllipsisIcon';
import CustomMenu from '@components/CustomMenu/CustomMenu';

import { Translation } from '@components/Translation/Translation';

import {
    $commonTemplates,
    openAdminDialogEvent,
    setActiveTemplateIdEvent,
} from '../../../store';

import styles from './RoomTableItemActions.module.scss';
import { AdminDialogsEnum } from '../../../store/types';

const RoomTableItemActions = memo(
    ({
        actionId,
        withSubdomain = false,
    }: {
        actionId: string;
        withSubdomain?: boolean;
    }) => {
        const actionButtonRef = useRef(null);
        const {
            value: isMenuOpen,
            onSwitchOn: onShowMenu,
            onSwitchOff: onHideMenu,
        } = useToggle(false);

        const templateData = useStoreMap({
            store: $commonTemplates,
            keys: [actionId],
            fn: (state, [templateId]) =>
                state?.state?.list?.find(
                    template => template.id === templateId,
                ) || null,
        });

        const handleOpenSettingsRoom = useCallback(event => {
            event?.stopPropagation();
            onShowMenu();
        }, []);

        const handleRoomAction = useCallback(
            event => {
                event?.stopPropagation();
                setActiveTemplateIdEvent(actionId);

                if (!templateData?.isPublic) {
                    openAdminDialogEvent(AdminDialogsEnum.publishRoomDialog);
                } else {
                    openAdminDialogEvent(AdminDialogsEnum.revokeRoomDialog);
                }
            },
            [templateData?.isPublic],
        );

        const handleDeleteRoom = useCallback(
            event => {
                event?.stopPropagation();
                openAdminDialogEvent(AdminDialogsEnum.confirmDeleteRoomDialog);
                setActiveTemplateIdEvent(templateData?.id);
                onHideMenu();
            },
            [templateData?.id],
        );

        const handleEditRoom = useCallback(
            event => {
                event?.stopPropagation();
                Router.push(
                    `/rooms/edit/${templateData?.id}/${
                        withSubdomain ? 'subdomain' : ''
                    }`,
                );
                onHideMenu();
            },
            [templateData?.id],
        );

        const handleHideMenu = useCallback(event => {
            event?.stopPropagation();
            onHideMenu();
        }, []);

        const menuItemsData = useMemo(() => {
            return [
                {
                    id: 0,
                    onClick: handleEditRoom,
                    Component: (
                        <CustomTypography>
                            <Translation
                                nameSpace="common"
                                translation="buttons.edit"
                            />
                        </CustomTypography>
                    ),
                },
                {
                    id: 1,
                    onClick: handleDeleteRoom,
                    Component: (
                        <CustomTypography>
                            <Translation
                                nameSpace="common"
                                translation="buttons.delete"
                            />
                        </CustomTypography>
                    ),
                },
            ];
        }, []);

        return (
            <CustomGrid
                container
                alignItems="center"
                justifyContent="flex-end"
                wrap="nowrap"
                className={styles.container}
                gap={1}
            >
                <ActionButton
                    className={clsx(styles.button, {
                        [styles.revoke]: templateData?.isPublic,
                        [styles.publish]: !templateData?.isPublic,
                    })}
                    onAction={handleRoomAction}
                    variant="decline"
                    label={
                        <CustomTypography variant="body2">
                            <Translation
                                nameSpace="rooms"
                                translation={
                                    templateData?.isPublic
                                        ? 'buttons.revoke'
                                        : 'buttons.publish'
                                }
                            />
                        </CustomTypography>
                    }
                />
                <ActionButton
                    ref={actionButtonRef}
                    className={styles.deleteButton}
                    onAction={handleOpenSettingsRoom}
                    variant="decline"
                    Icon={<EllipsisIcon width="18px" height="18px" />}
                />
                <CustomMenu
                    open={isMenuOpen}
                    menuItemsData={menuItemsData}
                    buttonRef={actionButtonRef}
                    onClose={handleHideMenu}
                />
            </CustomGrid>
        );
    },
);

RoomTableItemActions.displayName = 'RoomTableItemActions';

export { RoomTableItemActions };
