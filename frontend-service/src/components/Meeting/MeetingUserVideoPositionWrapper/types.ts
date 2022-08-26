import React from 'react';

export type MeetingUserVideoPositionWrapperProps = Required<
    React.PropsWithChildren<{
        isScreensharing?: boolean;
        bottom: number | undefined;
        left: number | undefined;
    }>
>;
