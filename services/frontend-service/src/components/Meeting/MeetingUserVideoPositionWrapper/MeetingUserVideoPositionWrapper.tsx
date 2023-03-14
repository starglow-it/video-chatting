import React, { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Box } from '@mui/material';

// custom
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

// types
import Draggable, { ControlPosition, DraggableData, DraggableEvent } from 'react-draggable';
import { useToggle } from '@hooks/useToggle';
import { roundNumberToPrecision } from 'shared-utils';
import { useStore } from 'effector-react';
import { MeetingUserVideoPositionWrapperProps } from './types';
// styles
import styles from './MeetingUserVideoPositionWrapper.module.scss';
import { $windowSizeStore } from '../../../store'

const Component: React.FunctionComponent<MeetingUserVideoPositionWrapperProps> = ({
    children,
    isScreenSharing,
    bottom,
    left,
    isLocal,
}: MeetingUserVideoPositionWrapperProps) => {
    const {
        width,
        height
    } = useStore($windowSizeStore);
    const {
        value: isDragging,
        onSwitchOn: handleOnDragging,
        onSwitchOff: handleOffDragging,
    } = useToggle(false);

    const [finalBottom, setBottom] = useState('50%');
    const [finalLeft, setLeft] = useState('50%');

    const [draggablePosition, setDraggablePosition] = useState<ControlPosition>(
		{
			x: 0,
			y: 0,
		},
	);

    const contentRef = useRef<HTMLDivElement>(null);

    const handleStopDrag = (_: DraggableEvent, data: DraggableData) => {
        setDraggablePosition({
            x: data.x,
            y: data.y,
        });
        const leftPercentage = roundNumberToPrecision(
            (data.x + (contentRef.current?.clientWidth ?? 0) / 2) / width,
            2,
        );

        const topPercentage = roundNumberToPrecision(
            (data.y + (contentRef.current?.clientHeight ?? 0) / 2) / height,
            2,
        );
        console.log('pos', leftPercentage, topPercentage)
        handleOffDragging()
    }
    const handleStartDrag = (event: DraggableEvent) => {
        if (event.type === 'mousedown') {
            setTimeout(() => {
                handleOnDragging() 
            }, 300);
        }        
    }


    useEffect(() => {        
        if (!isScreenSharing) {            
            const percentLeft = (left || 0) * 100
            const percentBottom = (bottom || 0) * 100
            setLeft(`${percentLeft}%`);
            setBottom(`${percentBottom}%`);                 
        }
    }, [isScreenSharing, bottom, left]);


    useLayoutEffect(() => {
		const xPosition = width * (left ?? 0)//  - (contentRef.current?.clientWidth ?? 0) / 2;
		const yPosition = height * (1 - (bottom ?? 0)) - (contentRef.current?.clientHeight ?? 0);

		setDraggablePosition({
			x: xPosition,
			y: yPosition,
		});
	}, [width, height, bottom, left]);

    if (bottom && left) {
        if(isLocal && !isScreenSharing){
            return (                
                    <Box
                        className={styles.boxDraggable}
                        ref={contentRef}
                    >
                        <Draggable
                            axis='both'
                            onStart={handleStartDrag}                         
                            onStop={handleStopDrag}
                            nodeRef={contentRef}
                            position={draggablePosition}
                        >                        
                            <Box>
                                {children}
                                <Box
                                    className={clsx(styles.boxPreventClick, {[styles.show]: isDragging})}
                                />
                            </Box>    
                        </Draggable>
                    </Box>
            )
        }
    }

    return (
        <CustomBox
            sx={!isScreenSharing ? { bottom: finalBottom, left: finalLeft } : {}}
            className={clsx(styles.videoWrapper, { [styles.sharing]: isScreenSharing })}
        >
            {children}
        </CustomBox>
    )
};

export const MeetingUserVideoPositionWrapper = memo(Component);
