import React from 'react';

export type MeetingBackgroundVideoProps = Required<React.PropsWithChildren> & {
    src: string;
    templateType: 'video' | 'image' | string;
    videoClassName?: string;
};
