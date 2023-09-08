import React, { memo, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Box } from '@mui/material';

// custom
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

// types
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable';
import { useToggle } from '@hooks/useToggle';
import { roundNumberToPrecision } from 'shared-utils';
import { useStore } from 'effector-react';
import { MeetingUserVideoPositionWrapperProps } from './types';
// styles
import styles from './MeetingUserVideoPositionWrapper.module.scss';
import { $windowSizeStore } from '../../../store';
import { updateUserSocketEvent } from '../../../store/roomStores';

const Component: React.FunctionComponent<
    MeetingUserVideoPositionWrapperProps
> = ({
    children,
    isScreenSharing,
    bottom,
    left,
    userId,
}: MeetingUserVideoPositionWrapperProps) => {
    const { width, height } = useStore($windowSizeStore);
    const {
        value: isDragging,
        onSwitchOn: handleOnDragging,
        onSwitchOff: handleOffDragging,
    } = useToggle(false);
    const [defaultPos, setDefaultPos] = useState<Record<string, number | null>>(
        {
            left: null,
            bottom: null,
        },
    );
    const [finalLeft, setLeft] = useState<number | null>(null);
    const [finalTop, setTop] = useState<number | null>(null);

    const contentRef = useRef<HTMLDivElement>(null);
    const refPreventBox = useRef<HTMLDivElement>(null);
    const isDrag = useRef(false);

    const handleStopDrag = (data: DraggableData) => {
        if (isDrag.current) {
            const contentRect = contentRef.current?.getBoundingClientRect();
            const leftRect = contentRect?.left || 0;
            const bottomRect = contentRect?.bottom || 0;

            const percentLeft = roundNumberToPrecision(leftRect / width, 2);
            const percentTop = roundNumberToPrecision(
                bottomRect / height, // use bottom instead of top , it include height of element, make easy to convert offset bottom
                2,
            );
            const percentBottom = roundNumberToPrecision(1 - percentTop, 2);
            setLeft(data.x);
            setTop(data.y);
            setDefaultPos({
                left: percentLeft,
                bottom: percentBottom,
            });
            updateUserSocketEvent({
                id: userId,
                userPosition: {
                    bottom: percentBottom,
                    left: percentLeft,
                },
            }).then(() => {
                isDrag.current = false;
                refPreventBox.current?.classList.remove(styles.show);
                handleOffDragging();
            });
        }
    };
    const handleStartDrag = () => {
        if (!isDrag.current) {
            isDrag.current = true;
            refPreventBox.current?.classList.add(styles.show);
            handleOnDragging();
        }
    };

    const eventControl = (event: DraggableEvent, data: DraggableData) => {
        if (event.type === 'mouseup' || event.type === 'touchend') {
            handleStopDrag(data);
        }
    };

    useEffect(() => {
        if (
            !isScreenSharing &&
            (defaultPos.left !== left || defaultPos.bottom !== bottom) &&
            !isDragging
        ) {
            const percentLeft = roundNumberToPrecision((left || 0) * width, 2);
            const rect = contentRef.current?.getBoundingClientRect();
            const subTopPercentage = roundNumberToPrecision(
                (rect?.height || 0) / height,
                2,
            );
            const percentTop = roundNumberToPrecision(
                Math.abs(1 - (bottom || 0) - subTopPercentage) * height,
                2,
            );
            setLeft(prev => (prev !== percentLeft ? percentLeft : prev));
            setTop(prev => (prev !== percentTop ? percentTop : prev));
            setDefaultPos({
                left: left !== undefined ? left : null,
                bottom: bottom !== undefined ? bottom : null,
            });
        }
    }, [isScreenSharing, bottom, left, defaultPos, isDragging]);

    return (
        <Draggable
            axis="both"
            onStop={eventControl}
            onDrag={handleStartDrag}
            disabled={isScreenSharing}
            position={{
                x: finalLeft || 0,
                y: finalTop || 0,
            }}
        >
            <CustomBox
                className={clsx(styles.boxDraggable, {
                    [styles.dragSharing]: isScreenSharing,
                })}
                ref={contentRef}
            >
                {children}
                <Box ref={refPreventBox} className={styles.boxPreventClick} />
            </CustomBox>
        </Draggable>
    );
};

export const MeetingUserVideoPositionWrapper = memo(Component);
