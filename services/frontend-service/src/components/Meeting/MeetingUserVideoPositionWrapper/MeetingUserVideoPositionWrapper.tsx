import React, {
    memo,
    useEffect,
    useRef,
    useState,
} from 'react';
import clsx from 'clsx';
import { Box } from '@mui/material';

// custom
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
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
import {
    updateUserSocketEvent,
} from '../../../store/roomStores';

const Component: React.FunctionComponent<
    MeetingUserVideoPositionWrapperProps
> = ({
    children,
    isScreenSharing,
    bottom,
    left,
    userId,
}: MeetingUserVideoPositionWrapperProps) => {
    const {
        width,
        height
    } = useStore($windowSizeStore);
    const refTimer = useRef<NodeJS.Timeout | null>(null);
    const {
        value: isDragging,
        onSwitchOn: handleOnDragging,
        onSwitchOff: handleOffDragging,
    } = useToggle(false);
    const [defaultPos, setDefaultPos] = useState<Record<string, number | null>>({
        left: null,
        bottom: null
    })
    const [finalLeft, setLeft] = useState<number | null>(null);
    const [finalTop, setTop] = useState<number | null>(null);

    const contentRef = useRef<HTMLDivElement>(null);

    const handleStopDrag = (data: DraggableData) => {
        if (isDragging) {
            const contentRect = contentRef.current?.getBoundingClientRect();
            const leftRect = contentRect?.left || 0
            const bottomRect = contentRect?.bottom || 0

            const percentLeft = roundNumberToPrecision(leftRect / width, 2);
            const percentTop = roundNumberToPrecision(
                bottomRect / height, // use bottom instead of top , it include height of element, make easy to convert offset bottom
                2,
            );
            const percentBottom = roundNumberToPrecision(1 - percentTop, 2)
            setLeft(data.x)
            setTop(data.y)
            setDefaultPos({
                left: percentLeft,
                bottom: percentBottom
            })
            updateUserSocketEvent({
                id: userId,
                userPosition: {
                    bottom: percentBottom,
                    left: percentLeft,
                },
            });
        }
        setTimeout(() => {
            handleOffDragging();
        }, 500)
    };
    const handleStartDrag = () => {
        handleOnDragging();
    };

    const eventControl = (event: DraggableEvent, data: DraggableData) => {
        if (event.type === 'mousedown') {
            refTimer.current = setTimeout(() => {
                handleStartDrag();
            }, 300);
        }

        if (event.type === 'mouseup' || event.type === 'touchend') {
            if(refTimer?.current){
                clearTimeout(refTimer.current);
            }
            handleStopDrag(data);
        }
    };

    useEffect(() => {
        if (!isScreenSharing && (defaultPos.left !== left || defaultPos.bottom !== bottom) && !isDragging) {
            const percentLeft = roundNumberToPrecision((left || 0) * width, 2);
            const rect = contentRef.current?.getBoundingClientRect()
            const subTopPercentage = roundNumberToPrecision(
                (rect?.height || 0) / height,
                2,
            );
            const percentTop = roundNumberToPrecision(Math.abs(1 - (bottom || 0) - subTopPercentage) * height, 2)
            setLeft(prev => prev !== percentLeft ? percentLeft : prev);
            setTop(prev => prev !== percentTop ? percentTop : prev)
            setDefaultPos({
                left: left !== undefined ? left : null,
                bottom: bottom !== undefined ? bottom : null
            })            
        }
    }, [isScreenSharing, bottom, left, defaultPos, isDragging]);
    
    const isRender = (finalTop !== null && finalLeft !== null)

    return (
        <ConditionalRender
            condition={Boolean(isRender)}
        >
            {/* <ConditionalRender condition={isLocal}> */}
            <Draggable
                axis="both"
                onStart={eventControl}
                onStop={eventControl}
                disabled={isScreenSharing}
                position={{
                    x: finalLeft || 0,
                    y: finalTop || 0
                }}
            >
                <CustomBox
                    className={clsx(styles.boxDraggable, {
                        [styles.dragSharing]: isScreenSharing,
                    })}
                    ref={contentRef}
                >
                    {children}
                    <Box
                        className={clsx(styles.boxPreventClick, {
                            [styles.show]: isDragging,
                        })}
                    />
                </CustomBox>
            </Draggable>
            {/* </ConditionalRender> */}
            {/* <ConditionalRender condition={!isLocal}>
                <CustomBox
                    sx={!isScreenSharing ? { bottom: finalBottom, left: finalLeft } : {}}
                    className={clsx(styles.videoWrapper, { [styles.sharing]: isScreenSharing })}
                >
                    {children}
                </CustomBox>
            </ConditionalRender> */}
        </ConditionalRender>
    );
};

export const MeetingUserVideoPositionWrapper = memo(Component);
