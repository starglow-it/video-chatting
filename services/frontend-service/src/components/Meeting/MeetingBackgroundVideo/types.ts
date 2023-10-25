import React from 'react';
import { IMediaLink } from 'shared-types';

export type MeetingBackgroundVideoProps = Required<React.PropsWithChildren> & {
    src: string;
    templateType: 'video' | 'image' | string;
    videoClassName?: string;
    mediaLink: IMediaLink | null;
};
