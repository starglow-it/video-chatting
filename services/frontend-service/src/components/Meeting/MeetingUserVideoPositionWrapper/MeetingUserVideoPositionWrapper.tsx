import React, { memo, useEffect, useState } from 'react';
import clsx from 'clsx';

// custom
import { CustomBox } from 'shared-frontend/library';

// types
import { MeetingUserVideoPositionWrapperProps } from './types';

// styles
import styles from './MeetingUserVideoPositionWrapper.module.scss';

const Component: React.FunctionComponent<MeetingUserVideoPositionWrapperProps> = ({
    children,
    isScreenSharing,
    bottom,
    left,
}: MeetingUserVideoPositionWrapperProps) => {
    const [finalBottom, setBottom] = useState('50%');
    const [finalLeft, setLeft] = useState('50%');

    useEffect(() => {
        if (!isScreenSharing) {
            setLeft(`${(left || 0) * 100}%`);
            setBottom(`${(bottom || 0) * 100}%`);
        }
    }, [isScreenSharing, bottom, left]);

    if (bottom && left) {
        return (
            <CustomBox
                sx={!isScreenSharing ? { bottom: finalBottom, left: finalLeft } : {}}
                className={clsx(styles.videoWrapper, { [styles.sharing]: isScreenSharing })}
            >
                {children}
            </CustomBox>
        );
    }

    return null;
};

export const MeetingUserVideoPositionWrapper = memo(Component);
