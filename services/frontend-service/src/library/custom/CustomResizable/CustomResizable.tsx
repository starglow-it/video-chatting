import { ResizableBox } from 'react-resizable';
import { CustomResizableProps } from './type';
import React, { Fragment, memo } from 'react';
import 'node_modules/react-resizable/css/styles.css';

const Component = ({
    width = 75,
    height = 75,
    disable = false,
    children,
    ...restProps
}: CustomResizableProps) =>
    !disable ? (
        <ResizableBox width={width} height={height} axis="both" {...restProps}>
            {children}
        </ResizableBox>
    ) : (
        <Fragment>{children}</Fragment>
    );
export const CustomResizable = memo(Component);
