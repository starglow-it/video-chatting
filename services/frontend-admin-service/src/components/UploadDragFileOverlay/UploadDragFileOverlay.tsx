import React, {memo} from "react";

import styles from "./UploadDragFileOverlay.module.scss";

import {CustomGrid} from "shared-frontend/library/custom/CustomGrid";
import {ArrowUp} from "shared-frontend/icons/OtherIcons/ArrowUp";
import {CustomTypography} from "shared-frontend/library/custom/CustomTypography";

import { Translation } from "@components/Translation/Translation";

export const UploadDragFileOverlay = memo(({ title }: { title: string }) => {
    return (
        <CustomGrid
            container
            alignItems="center"
            justifyContent="center"
            direction="column"
            gap={1.5}
            className={styles.content}
        >
            <CustomGrid
                item
                container
                className={styles.iconWrapper}
            >
                <ArrowUp
                    width="20px"
                    height="25px"
                    className={styles.icon}
                />
            </CustomGrid>
            <CustomTypography
                variant="h2bold"
                color="colors.white.primary"
            >
                <Translation
                    nameSpace="rooms"
                    translation={title}
                />
            </CustomTypography>
        </CustomGrid>
    );
});