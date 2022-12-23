import React, {memo} from "react";

import {CustomGrid} from "shared-frontend/library/custom/CustomGrid";
import {CustomImage} from "shared-frontend/library/custom/CustomImage";
import {CustomTypography} from "shared-frontend/library/custom/CustomTypography";

import styles from './RoomsTablePreviewItem.module.scss';

export const RoomsTablePreviewItem = memo(({ src, roomName }: { src?: string; roomName: string }) => {
    return (
        <CustomGrid container alignItems="center" gap={1.5}>
            {src
                ? (
                    <CustomImage
                        className={styles.previewImage}
                        width="42px"
                        height="28px"
                        src={src}
                    />
                )
                : null
            }
            <CustomTypography variant="body2">
                {roomName}
            </CustomTypography>
        </CustomGrid>
    )
})