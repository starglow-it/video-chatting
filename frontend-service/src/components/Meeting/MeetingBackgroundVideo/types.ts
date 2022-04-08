import React from 'react';

export type MeetingBackgroundVideoProps = Required<React.PropsWithChildren<any>> & {
    src: string;
    isScreenSharing: boolean;
};
