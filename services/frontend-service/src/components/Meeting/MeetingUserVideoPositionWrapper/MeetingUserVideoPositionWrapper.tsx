import React, {
    memo,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import clsx from 'clsx';
import { Box } from '@mui/material';

// custom
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

// types
import Draggable, { DraggableEvent } from 'react-draggable';
import { useToggle } from '@hooks/useToggle';
import { roundNumberToPrecision } from 'shared-utils';
import { useStore } from 'effector-react';
import { MeetingUserVideoPositionWrapperProps } from './types';
// styles
import styles from './MeetingUserVideoPositionWrapper.module.scss';
import { $windowSizeStore } from '../../../store';
import {
    updateUserSocketEvent,
    $localUserStore,
} from '../../../store/roomStores';

const Component: React.FunctionComponent<
    MeetingUserVideoPositionWrapperProps
> = ({
    children,
    isScreenSharing,
    bottom,
    left,
    isLocal,
    userId,
}: MeetingUserVideoPositionWrapperProps) => {
    const { width, height } = useStore($windowSizeStore);
    const [isInitPos, setInitPos] = useState(false);
    const refTimer = useRef<NodeJS.Timeout | null>(null);
    const localUser = useStore($localUserStore);
    const {
        value: isDragging,
        onSwitchOn: handleOnDragging,
        onSwitchOff: handleOffDragging,
    } = useToggle(false);

    const [finalBottom, setBottom] = useState('');
    const [finalLeft, setLeft] = useState('');

    const contentRef = useRef<HTMLDivElement>(null);

    const handleStopDrag = () => {
        if (isDragging) {
            const { left, bottom } =
                contentRef.current?.getBoundingClientRect();
            const subLeftPercentage = roundNumberToPrecision(left / width, 2);
            const subTopPercentage = roundNumberToPrecision(
                bottom / height, // use bottom instead of top , it include height of element, make easy to convert offset bottom
                2,
            );
            updateUserSocketEvent({
                id: userId,
                userPosition: {
                    bottom: roundNumberToPrecision(1 - subTopPercentage, 2),
                    left: subLeftPercentage,
                },
            });
        }
        handleOffDragging();
    };
    const handleStartDrag = () => {
        !isInitPos && setInitPos(true);
        handleOnDragging();
    };

    const eventControl = (event: DraggableEvent) => {
        if (event.type === 'mousedown') {
            refTimer.current = setTimeout(() => {
                handleStartDrag();
            }, 300);
        }

        if (event.type === 'mouseup' || event.type === 'touchend') {
            refTimer?.current && clearTimeout(refTimer.current);
            handleStopDrag();
        }
    };

    useEffect(() => {
        if (!isScreenSharing && (!isInitPos )) {
            const percentLeft = (left || 0) * 100;
            const percentBottom = (bottom || 0) * 100;
            setLeft(`${percentLeft}%`);
            setBottom(`${percentBottom}%`);
        }
    }, [isScreenSharing, bottom, left, isInitPos]);

    return (
        <ConditionalRender
            condition={Boolean(finalBottom !== '' && finalLeft !== '')}
        >
            {/* <ConditionalRender condition={isLocal}> */}
            <Draggable
                axis="both"
                onStart={eventControl}
                onStop={eventControl}
                disabled={isScreenSharing}
            >
                <CustomBox
                    className={clsx(styles.boxDraggable, {
                        [styles.dragSharing]: isScreenSharing,
                    })}
                    style={{
                        bottom: finalBottom,
                        left: finalLeft,
                    }}
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
