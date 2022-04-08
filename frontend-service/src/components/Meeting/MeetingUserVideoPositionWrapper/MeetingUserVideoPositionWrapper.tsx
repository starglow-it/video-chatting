import React, { memo } from 'react';
import clsx from 'clsx';

// custom
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// types
import { MeetingUserVideoPositionWrapperProps } from './types';

// styles
import styles from './MeetingUserVideoPositionWrapper.module.scss';

const MeetingUserVideoPositionWrapper = memo(
    ({ children, isScreensharing, top, left }: MeetingUserVideoPositionWrapperProps) => (
        <CustomBox
            sx={{ top: `${top * 100}%`, left: `${left * 100}%` }}
            className={clsx(styles.videoWrapper, { [styles.sharing]: isScreensharing })}
        >
            {children!}
        </CustomBox>
    ),
);

export { MeetingUserVideoPositionWrapper };
