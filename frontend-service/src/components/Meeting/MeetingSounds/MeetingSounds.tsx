import React, { memo, useEffect, useRef } from 'react';
import { useStore } from 'effector-react';

// stores
import { $meetingSoundType, setMeetingSoundType } from '../../../store';

// types
import { MeetingSoundsEnum } from '../../../store/types';

const SOUNDS = {
    [MeetingSoundsEnum.NoSound]: '',
    [MeetingSoundsEnum.NewAttendee]: '/audio/new_attendee.mp3',
} as { [key in MeetingSoundsEnum]: string };

const Component = () => {
    const meetingSoundType = useStore($meetingSoundType);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (meetingSoundType) {
            const audioSrc = SOUNDS[meetingSoundType];

            if (audioRef?.current && audioSrc) {
                audioRef.current.src = audioSrc;
                audioRef.current.onloadeddata = () => {
                    audioRef?.current?.play?.().then(() => {
                        setMeetingSoundType(MeetingSoundsEnum.NoSound);
                    });
                };
            }
        }
    }, [meetingSoundType]);

    return <audio ref={audioRef} style={{ display: 'none' }} />;
};

export const MeetingSounds = memo(Component);
