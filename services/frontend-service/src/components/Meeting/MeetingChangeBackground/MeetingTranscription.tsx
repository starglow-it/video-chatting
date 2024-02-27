import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    LinearProgress,
} from '@mui/material';
import clsx from 'clsx';
import { useStore } from 'effector-react';
import { memo, useEffect, useRef, useState } from 'react';
import { ImageIcon } from 'shared-frontend/icons/OtherIcons/ImageIcon';
import { RoundCloseIcon } from 'shared-frontend/icons/RoundIcons/RoundCloseIcon';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTooltip } from 'shared-frontend/library/custom/CustomTooltip';
import { Translation } from '@library/common/Translation/Translation';
import { useBrowserDetect } from '@hooks/useBrowserDetect';
import { UploadBackground } from './Upload';
import styles from './MeetingChangeBackground.module.scss';
import { Media } from './Media';
import { Barge } from './Barge';
import {
    $backgroundMeetingStore,
    $isLoadMoreMediasStore,
    $isToggleBackgroundPanel,
    $meetingTemplateStore,
    $transcriptionParticipant,
    $transcriptionResults,
    deleteMediaMeetingFx,
    setCategoryEvent,
    setMediaEvent,
    setQueryMediasEvent,
    uploadNewBackgroundFx,
    startTranscription,
    $transcriptionResultsGuest,
    $transcriptionParticipantGuest,
    setTranscriptionResult,
} from '../../../store/roomStores';

const Component = () => {
    const transcription = useStore($transcriptionResults);
    const transcriptionParticipant = useStore($transcriptionParticipant);

    const transcriptionGuest = useStore($transcriptionResultsGuest);
    const transcriptionParticipantGuest = useStore(
        $transcriptionParticipantGuest,
    );

    const { medias, categorySelected, mediaSelected, categories, count } =
        useStore($backgroundMeetingStore);
    const isLoadMore = useStore($isLoadMoreMediasStore);
    const isLoading = useStore(uploadNewBackgroundFx.pending);
    const { isMobile } = useBrowserDetect();
    const isChangeBackgroundOpen = useStore($isToggleBackgroundPanel);

    const [isExpand, setIsExpand] = useState<boolean>(
        isMobile ? isChangeBackgroundOpen : false,
    );
    const [isAnimation, setIsAnimation] = useState<boolean>(false);
    const refScroll = useRef<HTMLElement>();
    const isHideUpload = categories.some(
        item => item.key === 'myrooms' && item.id === categorySelected,
    );
    const meetingTemplate = useStore($meetingTemplateStore);

    useEffect(() => {
        if (isExpand && categories.length && !categorySelected)
            setCategoryEvent({
                categorySelected: categories[0].id,
            });
    }, [isExpand]);

    useEffect(() => {
        const sendMessage = () => {
            startTranscription({
                note: `Your message after 4 seconds - ${new Date().toLocaleTimeString()}`,
            });
            // setTimeout(sendMessage, 4000);
        };
        sendMessage();
        // setTranscriptionResult('Hello This is test')
    }, []);

    useEffect(() => {
        if (refScroll.current) refScroll.current.scrollTop = 0;
    }, [categorySelected, isLoading]);

    const handleSelectBackground = (id: string) => {
        setMediaEvent({ mediaSelected: id });
    };

    const handleSelectType = (id: string) => {
        if (id !== categorySelected) {
            setCategoryEvent({ categorySelected: id });
        }
    };

    const handleScrollEnd = () => {
        if (!isLoadMore && medias.length < count) setQueryMediasEvent();
    };

    const changeExpand = (event: React.SyntheticEvent, expanded: boolean) => {
        setIsExpand(expanded);
    };

    const handleDeleteMedia = (mediaId: string) => {
        deleteMediaMeetingFx({
            categoryId: categorySelected,
            userTemplateId: meetingTemplate.id,
            deleteId: mediaId,
        });
    };

    return (
        <>
            <CustomTooltip
                title={
                    !isExpand && isAnimation ? (
                        <Translation
                            nameSpace="meeting"
                            translation="changeBackground.text"
                        />
                    ) : (
                        ''
                    )
                }
                placement="left"
                disableHoverListener={isExpand}
            >
                <CustomPaper
                    className={clsx(styles.commonOpenTranscriptionPanel, {
                        [styles.expanded]: isExpand,
                        [styles.mobile]: isExpand && isMobile,
                    })}
                    variant="black-glass"
                >
                    <Accordion
                        expanded={isExpand}
                        onChange={changeExpand}
                        className={clsx(styles.accordion)}
                        disabled={isMobile}
                        TransitionProps={{
                            timeout: {
                                appear: 600,
                                enter: 700,
                                exit: 0,
                            },
                            onExited: () => setIsAnimation(true),
                            onEntered: () => setIsAnimation(false),
                        }}
                    >
                        <div
                            style={{
                                position: 'fixed',
                                textOverflow: 'ellipsis',
                                backgroundColor: 'rgba(255,255,255,0.5)',
                                borderRadius: '5px',
                                padding: '2px',
                            }}
                        >
                            {transcription
                                ? `${transcriptionParticipant}-${transcription}`
                                : ``}
                        </div>
                    </Accordion>
                </CustomPaper>
            </CustomTooltip>
            <CustomTooltip
                title={
                    !isExpand && isAnimation ? (
                        <Translation
                            nameSpace="meeting"
                            translation="changeBackground.text"
                        />
                    ) : (
                        ''
                    )
                }
                placement="left"
                disableHoverListener={isExpand}
            >
                <CustomPaper
                    className={clsx(styles.commonOpenTranscriptionPanelGuest, {
                        [styles.expanded]: isExpand,
                        [styles.mobile]: isExpand && isMobile,
                    })}
                    variant="black-glass"
                >
                    <Accordion
                        expanded={isExpand}
                        onChange={changeExpand}
                        className={clsx(styles.accordion)}
                        disabled={isMobile}
                        TransitionProps={{
                            timeout: {
                                appear: 600,
                                enter: 700,
                                exit: 0,
                            },
                            onExited: () => setIsAnimation(true),
                            onEntered: () => setIsAnimation(false),
                        }}
                    >
                        <div
                            style={{
                                position: 'fixed',
                                textOverflow: 'ellipsis',
                                backgroundColor: 'rgba(255,255,255,0.5)',
                                borderRadius: '5px',
                                padding: '2px',
                            }}
                        >
                            {transcriptionGuest
                                ? `${transcriptionParticipantGuest}- ${transcriptionGuest}`
                                : ``}
                        </div>
                    </Accordion>
                </CustomPaper>
            </CustomTooltip>
        </>
    );
};

export const MeetingTranscription = memo(Component);
