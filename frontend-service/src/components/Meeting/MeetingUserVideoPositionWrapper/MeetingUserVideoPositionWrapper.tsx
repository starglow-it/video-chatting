import React, {memo, useLayoutEffect, useState} from 'react';
import clsx from 'clsx';

// custom
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// types
import { MeetingUserVideoPositionWrapperProps } from './types';

// styles
import styles from './MeetingUserVideoPositionWrapper.module.scss';

const Component: React.FunctionComponent<MeetingUserVideoPositionWrapperProps> = ({ elevationIndex, children, isScreensharing, top, left }: MeetingUserVideoPositionWrapperProps) => {
    const [finalTop, setTop] = useState('50%');
    const [finalLeft, setLeft] = useState('50%');

    useLayoutEffect(() => {
        if (isScreensharing) {
            setLeft('calc(100% - 28px)');
            setTop(`calc(50% + ${70 * elevationIndex}px)`);
        } else {
            setLeft(`${left * 100}%`);
            setTop(`${top * 100}%`);
        }
    }, [isScreensharing, elevationIndex, top, left]);

    return (
        <>
            {top && left
                ? (
                    <CustomBox
                        sx={{ top: finalTop, left: finalLeft }}
                        className={clsx(styles.videoWrapper, { [styles.sharing]: isScreensharing })}
                    >
                        {children}
                    </CustomBox>
                )
                : null
            }
        </>
    );
};

export const MeetingUserVideoPositionWrapper = memo(Component);
