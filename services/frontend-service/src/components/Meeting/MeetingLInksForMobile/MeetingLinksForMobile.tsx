import { useMemo } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { useStore } from 'effector-react';
import {
    $isThereNewMessage,
    $meetingChat,
} from 'src/store/roomStores/meeting/meetingChat/model';
import { useCallback, useEffect, useRef } from 'react';
import { MeetingReactionKind } from 'shared-types';
import {
    $localUserStore,
    $meetingStore,
    $isOwner,
    $meetingTemplateStore,
    sendMeetingReactionEvent,
    sendMeetingUnReactionEvent,
    clickMeetingLinkSocketEvent
} from 'src/store/roomStores';
import { $isGoodsVisible } from '../../../store';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import styles from './MeetingLinksForMobile.module.scss';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

export const MeetingLinksForMobile = () => {
    const { list } = useStore($meetingChat);
    const isThereNewMessage = useStore($isThereNewMessage);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isGoodsVisible = useStore($isGoodsVisible);
    const localUserStore = useStore($localUserStore);
    const meetingStore = useStore($meetingStore);
    const isOwner = useStore($isOwner);

    const refScroll = useRef<any>(null);

    useEffect(() => {
        if (isThereNewMessage) {
            if (refScroll.current)
                refScroll.current.scrollTop = refScroll.current?.scrollHeight;
        }
    }, [isThereNewMessage]);

    const handleReaction = useCallback(
        (chatId: string, kind: MeetingReactionKind) => {
            sendMeetingReactionEvent({ meetingChatId: chatId, kind });
        },
        [],
    );

    const handleUnReaction = useCallback(
        (chatId: string, kind: MeetingReactionKind) => {
            sendMeetingUnReactionEvent({ meetingChatId: chatId, kind });
        },
        [],
    );

    const renderItems = useMemo(
        () =>
            (meetingTemplate?.links || []).map((link, index) => {
                const style = {
                    '--top': `${link.position.top * 100}%`,
                    '--left': `${link.position.left * 100}%`,
                } as React.CSSProperties;

                const handleOpenLink = () => {
                    let orgUrl = link.item;
                    let url = orgUrl;
                    if (!url.match(/^https?:\/\//i)) {
                        url = `http://${url}`;
                    }

                    if (!isOwner) {
                        clickMeetingLinkSocketEvent({ meetingId: meetingStore.id, url: orgUrl, userId: localUserStore.id });
                    }

                    return window.open(url, '_blank');
                };

                return (
                    <CustomPaper
                        style={style}
                        className={styles.linkItem}
                        onClick={handleOpenLink}
                    >
                        <CustomImage
                            width={30}
                            height={30}
                            src="/images/yellowLinkIcon.png"
                        />
                        <CustomTypography variant="body2" className={styles.linkText}>
                            {link.title}
                        </CustomTypography>
                    </CustomPaper>
                );
            }),
        [meetingTemplate?.links, isGoodsVisible],
    );

    return (
        <CustomGrid flex={1} display="flex" flexDirection="column">
            <IconButton className={styles.closeIconBtn} onClick={() => { }}>
                <CloseIcon className={styles.closeIcon} />
            </IconButton>
            <CustomGrid
                display="flex"
                alignItems="flex-start"
                justifyContent="flex-start"
                flexDirection="column"
                height="100%"
                className={styles.imageWrapper}
            >
                <CustomTypography
                    variant='body1bold'
                    nameSpace="meeting"
                    translation="linksForMobile.title"
                    color="white"
                    className={styles.chatTitle}
                />
            </CustomGrid>
            <CustomScroll
                className={styles.scroll}
                containerRef={(refS: any) => (refScroll.current = refS)}
            >
                <ConditionalRender
                    condition={
                        Boolean(meetingTemplate?.links?.length)}
                >
                    {renderItems}
                </ConditionalRender>
            </CustomScroll>
        </CustomGrid>
    );
};
