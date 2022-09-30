import React from 'react';
import { PopperProps } from '@mui/material';

export type CustomPopperProps = React.PropsWithChildren<
    {
        id: string;
        open: boolean;
    } & PopperProps
>;
