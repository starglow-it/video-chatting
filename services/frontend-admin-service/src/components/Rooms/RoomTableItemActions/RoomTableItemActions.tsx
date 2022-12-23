import React, {memo, useCallback} from "react";
import clsx from "clsx";
import { useStoreMap } from "effector-react";

import {CustomTooltip} from "shared-frontend/library/custom/CustomTooltip";
import {ActionButton} from "shared-frontend/library/common/ActionButton";
import {TrashIcon} from "shared-frontend/icons/OtherIcons/TrashIcon";
import {CustomGrid} from "shared-frontend/library/custom/CustomGrid";
import { CustomTypography } from "shared-frontend/library/custom/CustomTypography";

import {Translation} from "@components/Translation/Translation";

import {$commonTemplates } from "../../../store";

import styles from "./RoomTableItemActions.module.scss";

export const RoomTableItemActions = memo(({ actionId }: { actionId: string }) => {
    const templateData = useStoreMap({
        store: $commonTemplates,
        keys: [actionId],
        fn: (state, [templateId]) =>
            state?.state?.list?.find(template => template.id === templateId) || null,
    });

    const handleDeleteRoom = useCallback((event) => {
        event?.stopPropagation()
        console.log(actionId);
    }, []);

    const handleRevokeRoomStatus = useCallback((event) => {
        event?.stopPropagation();
        console.log(actionId);
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
                className={clsx(styles.button, {[styles.revoke]: !templateData?.draft, [styles.publish]: templateData?.draft})}
                onAction={handleRevokeRoomStatus}
                variant="decline"
                label={(
                    <CustomTypography variant="body2">
                        <Translation
                            nameSpace="rooms"
                            translation={!templateData?.draft ? "buttons.revoke" : "buttons.publish"}
                        />
                    </CustomTypography>
                )}
            />
            <CustomTooltip
                title={
                    <Translation
                        nameSpace="rooms"
                        translation="tooltips.deleteRoom"
                    />
                }
                placement="bottom"
            >
                <ActionButton
                    className={styles.deleteButton}
                    onAction={handleDeleteRoom}
                    variant="decline"
                    Icon={
                        <TrashIcon
                            width="18px"
                            height="18px"
                        />
                    }
                />
            </CustomTooltip>
        </CustomGrid>
    )
});