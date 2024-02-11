import { React, memo, useEffect, useRef, useState } from 'react';
import { useStore } from 'effector-react';
import { clsx } from 'clsx';

// stores
import { isMobile } from 'shared-utils';
import { $windowSizeStore } from '../../../store';
import {
    $meetingReactionsStore, getMeetingReactionsSocketEvent, $isOwner, $isOwnerInMeeting, $meetingStore, removeMeetingReactionEvent
} from '../../../store/roomStores';

// gsap
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';

import styles from './EmojiPlayground.module.scss'

gsap.registerPlugin(MotionPathPlugin);

const Component = ({ userId }: { userId: string }) => {
    const meetingReactions = useStore($meetingReactionsStore);
    const meeting = useStore($meetingStore);

    // const { height } = useStore($windowSizeStore);

    const container = useRef(null);

    const { contextSafe } = useGSAP({ scope: container });

    const startReactionBubbling = contextSafe((reaction) => {
        if (reaction.user === meeting.hostUserId) {
            console.log(reaction);

            gsap.set(`svg[data-key="${reaction.id}"]`, {
                height: `1500px`,
                width: "100%",
                position: "absolute",
                bottom: "-70%",
                left: "15%",
            });
            gsap.set(`path[data-key="${reaction.id}"]`, {
                height: '100%'
            });
            gsap.set(`img[data-key="${reaction.id}"]`, {
                width: "40px",
                height: "40px",
                position: "absolute",
                bottom: 0,
                left: "50%",
                // xPercent: -50,
            })

            gsap.to(`img[data-key="${reaction.id}"]`, {
                motionPath: {
                    path: `path[data-key="${reaction.id}"]`,
                    align: `path[data-key="${reaction.id}"]`,
                    alignOrigin: [0.5, 0.5],
                },
                width: `150px`,
                height: `150px`,
                duration: 7,
                delay: 0,
                ease: "power1.out",
                onComplete: () => {
                    // removeMeetingReactionEvent(reaction.id);
                }
            });
        } else {
            gsap.set(`svg[data-key="${reaction.id}"]`, {
                height: `500px`,
                width: "100%",
                position: "absolute",
                bottom: "30px",
                left: "0",
            });
            gsap.set(`path[data-key="${reaction.id}"]`, {
                height: '100%'
            });
            gsap.set(`img[data-key="${reaction.id}"]`, {
                width: "100px",
                height: "100px",
                position: "absolute",
                bottom: 0,
                left: "50%",
                zIndex: 9999
                // xPercent: -50,
            })

            gsap.to(`img[data-key="${reaction.id}"]`, {
                motionPath: {
                    path: `path[data-key="${reaction.id}"]`,
                    align: `path[data-key="${reaction.id}"]`,
                    alignOrigin: [0.5, 0.5],
                },
                width: `0px`,
                height: `0px`,
                display: 'none',
                duration: 7,
                delay: 0,
                ease: "power1.out",
                onComplete: () => {
                    // removeMeetingReactionEvent(reaction.id);
                }
            });
        }
    })

    useEffect(() => {
        getMeetingReactionsSocketEvent();
    }, [])

    const availableReactionArr = [
        {
            text: "rocket",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/512.gif"
        },
        {
            text: "party-popper",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif"
        },
        {
            text: "fire",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.gif"
        },
        {
            text: "raising-hands",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f64c/512.gif"
        },
        {
            text: "sparkling-heart",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f496/512.gif"
        },
        {
            text: "folded-hands",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f64f/512.gif"
        },
        {
            text: "partying-face",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f973/512.gif"
        },
        {
            text: "mind-blown",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f92f/512.gif"
        },
        {
            text: "joy",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f602/512.gif"
        },
        {
            text: "screaming",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f631/512.gif"
        },
        {
            text: "hearted-eyes",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f60d/512.gif"
        },
        {
            text: "thinking-face",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f914/512.gif"
        },
        {
            text: "see-no-evil-monkeys",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f648/512.gif"
        },
        {
            text: "light-bulb",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f4a1/512.gif"
        },
        {
            text: "person-raising-hands",
            icon: "https://img.icons8.com/emoji/96/person-raising-hand.png"
        },
        {
            text: "thumbs-up",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f44d/512.gif"
        },
        {
            text: "wave",
            icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f44b/512.gif"
        },
        {
            text: "okay",
            icon: "https://img.icons8.com/emoji/96/ok-hand-emoji.png"
        }
    ];

    useEffect(() => {
        console.log(meetingReactions);
        const length = meetingReactions.length;
        if (length > 0 && meetingReactions[length - 1].user === userId) {
            startReactionBubbling(meetingReactions[length - 1]);
        }
    }, [meetingReactions])

    return (
        <div className={clsx(styles.playgroundWrapper, { [styles.isParticipant]: userId !== meeting.hostUserId })} ref={container}>
            {meetingReactions.filter(reaction => reaction.user === userId).map(reaction => (<>
                <svg viewBox="0 0 22 110" fill="none" xmlns="http://www.w3.org/2000/svg" data-key={reaction.id} style={{ width: 0, height: 0 }}>
                    <path d="M14.6485 109C10.099 108.037 1 102.763 1 89.3636C1 72.615 22.6101 61.6417 20.904 40.8503C19.198 20.0588 15.7859 9.6631 1 1" data-key={reaction.id}></path>
                </svg>
                <img src={availableReactionArr.find(obj => obj.text === reaction.emojiName)?.icon} data-key={reaction.id} style={{ width: 0, height: 0 }}></img></>
            ))}
        </div>
    )
}

export const EmojiPlayground = memo(Component);