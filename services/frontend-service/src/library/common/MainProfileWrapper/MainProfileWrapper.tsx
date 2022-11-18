import React, { ForwardedRef, forwardRef, memo } from 'react';

import { CustomGrid } from 'shared-frontend/library';

import { MainContentWrapperProps } from './types';

const Component = (
    { className, children }: MainContentWrapperProps,
    ref: ForwardedRef<HTMLDivElement>,
) => (
    <CustomGrid
        ref={ref}
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{
            padding: '94px 20px 100px 20px',
        }}
        className={className}
    >
        {children}
    </CustomGrid>
);

export const MainProfileWrapper = memo(forwardRef(Component));
