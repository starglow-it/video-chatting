import React from 'react';

export type MeetingUserVideoPositionWrapperProps = Required<
    React.PropsWithChildren<{
        isScreensharing?: boolean;
        elevationIndex: number;
        top: number | undefined;
        left: number | undefined;
    }>
>;
