import { Resizable } from 'react-resizable';
import clsx from 'clsx';
import { CustomResizableProps } from './type';
import React, { memo } from 'react';
// import 'node_modules/react-resizable/css/styles.css';
import styles from './CustomResizable.module.scss';

const MyHandleComponent = ({
    handleAxis,
    innerRef,
    ...restProps
}: {
    handleAxis: string;
    innerRef: any;
}) => (
    <div
        ref={innerRef}
        className={clsx(
            styles['react-resizable-handle'],
            styles[`react-resizable-handle-${handleAxis}`],
        )}
        {...restProps}
    />
);

const MyHandle = React.forwardRef((props, ref) => (
    <MyHandleComponent innerRef={ref} {...props} />
));

const Component = ({
    width = 75,
    height = 75,
    disabled = false,
    children,
    ...restProps
}: CustomResizableProps) => (
    <Resizable
        width={width}
        height={height}
        axis="both"
        draggableOpts={{ disabled }}
        className={styles['react-resizable']}
        handle={<MyHandle />}
        {...restProps}
    >
        {children}
    </Resizable>
);
export const CustomResizable = memo(Component);
