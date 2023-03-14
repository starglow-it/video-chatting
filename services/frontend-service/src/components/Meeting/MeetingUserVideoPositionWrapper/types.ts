import React from 'react';

export type MeetingUserVideoPositionWrapperProps = Required<
    React.PropsWithChildren<{
        isScreenSharing?: boolean;
        bottom: number | undefined;
        left: number | undefined;
        isLocal: boolean
        size: number
    }>
>;
