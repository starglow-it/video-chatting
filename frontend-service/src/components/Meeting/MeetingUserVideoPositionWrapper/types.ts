import React from 'react';

export type MeetingUserVideoPositionWrapperProps = Required<
    React.PropsWithChildren<{
        isScreensharing?: boolean;
        elevationIndex: number;
        bottom: number | undefined;
        left: number | undefined;
        usersNumber: number | undefined;
    }>
>;
