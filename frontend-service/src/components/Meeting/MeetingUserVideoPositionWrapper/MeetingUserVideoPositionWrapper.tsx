import React, { memo, useLayoutEffect, useState } from 'react';
import clsx from 'clsx';

// custom
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// types
import { MeetingUserVideoPositionWrapperProps } from './types';

// styles
import styles from './MeetingUserVideoPositionWrapper.module.scss';

const Component: React.FunctionComponent<MeetingUserVideoPositionWrapperProps> = ({
    children,
    isScreensharing,
    bottom,
    left,
}: MeetingUserVideoPositionWrapperProps) => {
    const [finalBottom, setBottom] = useState('50%');
    const [finalLeft, setLeft] = useState('50%');

    useLayoutEffect(() => {
        if (!isScreensharing) {
            setLeft(`${(left || 0) * 100}%`);
            setBottom(`${(bottom || 0) * 100}%`);
        }
    }, [isScreensharing, bottom, left]);

    if (bottom && left) {
        return (
            <CustomBox
                sx={!isScreensharing ? { bottom: finalBottom, left: finalLeft } : {}}
                className={clsx(styles.videoWrapper, { [styles.sharing]: isScreensharing })}
            >
                {children}
            </CustomBox>
        );
    }

    return null;
};

export const MeetingUserVideoPositionWrapper = memo(Component);
