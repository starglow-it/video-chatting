import { React, memo, useEffect, useRef } from 'react';
import { useStore } from 'effector-react';

// stores
import { isMobile } from 'shared-utils';
import { MeetingReaction } from 'src/store/types';
import { $windowSizeStore } from '../../../store';
import {
    $meetingReactionsStore, getMeetingReactionSocketEvent, removeMeetingReactionEvent,
    // getMeetingNotesSocketEvent,
} from '../../../store/roomStores';

// gsap
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';

import styles from './EmojiPlayground.module.scss'

gsap.registerPlugin(MotionPathPlugin);

const Component = () => {
    const meetingReactions = useStore($meetingReactionsStore);
    const { height } = useStore($windowSizeStore);

    const container = useRef(null);
    const tempSvg = useRef(null);
    const tempPath = useRef(null);

    const { contextSafe } = useGSAP({ scope: container });

    const startReactionBubbling = contextSafe((reaction) => {
        console.log('Animation Start')

        gsap.set(tempSvg.current, {
            height: `200%`,
            width: "100%",
            position: "absolute",
            bottom: "-70%",
            left: "15%",
        });
        gsap.set(tempPath.current, {
            height: '100%'
        });
        gsap.set('#' + reaction.id, {
            width: "40px",
            height: "40px",
            position: "absolute",
            bottom: 0,
            left: "50%",
            // xPercent: -50,
        })

        gsap.to('#' + reaction.id, {
            motionPath: {
                path: tempPath.current,
                align: tempPath.current,
                alignOrigin: [0.5, 0.5],
            },
            width: `150px`,
            height: `150px`,
            duration: 7,
            delay: 0,
            ease: "power1.out",
            // onComplete: () => {
            //     removeMeetingReactionEvent(reaction.id);
            // }
        });
    })


    useEffect(() => {
        getMeetingReactionSocketEvent();
    })

    useEffect(() => {
        const length = meetingReactions.length;
        if (length > 0) startReactionBubbling(meetingReactions[length - 1]);
    }, [meetingReactions])

    return (
        <div className={styles.playgroundWrapper} ref={container}>
            <svg viewBox="0 0 22 110" fill="none" xmlns="http://www.w3.org/2000/svg" ref={tempSvg}>
                <path d="M14.6485 109C10.099 108.037 1 102.763 1 89.3636C1 72.615 22.6101 61.6417 20.904 40.8503C19.198 20.0588 15.7859 9.6631 1 1" ref={tempPath}></path>
            </svg>
            {meetingReactions.map(reaction => (
                <img src={reaction.src} id={reaction.id} style={{ width: 0, height: 0 }}></img>
            ))}
        </div>
    )
}

export const EmojiPlayground = memo(Component);