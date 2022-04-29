import React, { forwardRef, memo } from 'react';

import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

import { MainContentWrapperProps } from './types';

const MainProfileWrapper = memo(
    forwardRef(({ className, children }: MainContentWrapperProps, ref) => {
        return (
            <CustomGrid
                ref={ref}
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                    padding: '94px 20px 0px 20px',
                }}
                className={className}
            >
                {children}
            </CustomGrid>
        );
    }),
);

export { MainProfileWrapper };
