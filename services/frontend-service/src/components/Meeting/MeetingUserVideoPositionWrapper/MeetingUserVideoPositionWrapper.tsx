import React, { memo, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Box } from '@mui/material';

// custom
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

// types
import Draggable, { ControlPosition, DraggableData, DraggableEvent } from 'react-draggable';
import { useToggle } from '@hooks/useToggle';
import { MeetingUserVideoPositionWrapperProps } from './types';

// styles
import styles from './MeetingUserVideoPositionWrapper.module.scss';

const Component: React.FunctionComponent<MeetingUserVideoPositionWrapperProps> = ({
    children,
    isScreenSharing,
    bottom,
    left,
    isLocal,
    size
}: MeetingUserVideoPositionWrapperProps) => {
    const getInitPosition = (initLeft = 0, initBottom = 0, initSize = 0) => {
        const percentHeight = ((initSize + 42) * 100) / window.innerHeight
        const percentLeft = (initLeft || 0) * 100
        const percentBottom = (initBottom || 0) * 100
        const percentTop = (1 - (initBottom || 0)) * 100 
        return {
            initBottom: `${percentBottom}%`,
            initLeft: `${percentLeft}%`,
            initTop: `${percentTop - percentHeight}%`
        }
    }    

    const {
        value: isDragging,
        onSwitchOn: handleOnDragging,
        onSwitchOff: handleOffDragging,
    } = useToggle(false);

    const {initBottom, initLeft} = getInitPosition(left, bottom)
    const [finalBottom, setBottom] = useState(initBottom);
    const [finalLeft, setLeft] = useState(initLeft);

    const eventControl = (event: DraggableEvent) => {
        if (event.type === 'mousedown') {
            setTimeout(() => {
                handleOnDragging() 
            }, 300);
        }

        if (event.type === 'mouseup' || event.type === 'touchend') {
          setTimeout(() => {
            handleOffDragging();
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

    if (bottom && left) {
        if(isLocal && !isScreenSharing){
            return (                
                    <Box
                        className={styles.boxDraggable}
                        sx={{left: finalLeft, bottom: finalBottom}}
                    >
                        <Draggable
                            axis='both'
                            onStart={eventControl}                         
                            onStop={eventControl}
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
