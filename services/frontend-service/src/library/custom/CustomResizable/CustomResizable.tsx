import { ResizableBox } from 'react-resizable';
import { CustomResizableProps } from './type';
import React, { memo } from 'react';
import 'node_modules/react-resizable/css/styles.css';

const Component = ({
    width = 75,
    height = 75,
    children,
    ...restProps
}: CustomResizableProps) => 
     (
        <ResizableBox
            width={width}
            height={height}
            axis="both"
            {...restProps}
        >
            {children}
        </ResizableBox>
    );
;

export const CustomResizable = memo(Component);