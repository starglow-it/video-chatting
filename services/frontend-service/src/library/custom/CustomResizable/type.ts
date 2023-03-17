import { SyntheticEvent } from 'react';
import { ResizeCallbackData } from 'react-resizable';

export type CustomResizableProps = {
    width: number;
    height: number;
    children?: React.ReactNode;
    disabled: boolean;
    onResize?: (e: SyntheticEvent, data: ResizeCallbackData) => void;
    minConstraints: [number, number];
    onResizeStart?: (e: SyntheticEvent, data: ResizeCallbackData) => void;
    onResizeStop?: (e: SyntheticEvent, data: ResizeCallbackData) => void;
    resizeHandles: string[];
};
