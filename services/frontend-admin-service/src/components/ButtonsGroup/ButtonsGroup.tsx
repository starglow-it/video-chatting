import React from "react";

import {CustomGrid} from "shared-frontend/library/custom/CustomGrid";

import {PropsWithClassName} from "shared-frontend/types";

export const ButtonsGroup = ({ className, children }: React.PropsWithChildren<PropsWithClassName<any>>) => {
    return (
        <CustomGrid
            container
            wrap="nowrap"
            alignItems="center"
            gap={2}
            className={className}
        >
            {children}
        </CustomGrid>
    )
}