import { SyntheticEvent, memo, useEffect, useRef, useState } from 'react';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import clsx from 'clsx';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { RoundCloseIcon } from 'shared-frontend/icons/RoundIcons/RoundCloseIcon';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { MusicIcon } from 'shared-frontend/icons/OtherIcons/MusicIcon';
import { PauseIcon } from 'shared-frontend/icons/OtherIcons/PauseIcon';
import { PlayIcon } from 'shared-frontend/icons/OtherIcons/PlayIcon';
import styles from './MeetingManageAudio.module.scss';
import { AudioItem } from './AudioItem';
import { useStore, useStoreMap } from 'effector-react';
import {
    $isToggleMeetingAudioStore,
    $meetingAudioStore,
    $meetingTemplateStore,
    getMeetingAudioFx,
    toggleMeetingAudioEvent,
} from 'src/store/roomStores';
import { Translation } from '@library/common/Translation/Translation';
import { CustomTooltip } from 'shared-frontend/library/custom/CustomTooltip';

const Component = () => {
    const refToolTip = useRef();
    const audioList = useStoreMap({
        store: $meetingAudioStore,
        keys: [],
        fn: state => state.audioList.filter(item => item.audio !== null),
    });
    const isPlayAll = useStore($isToggleMeetingAudioStore);
    const { id } = useStore($meetingTemplateStore);
    const [isExpand, setIsExpand] = useState<boolean>(true);
    const [isAnimation, setIsAnimation] = useState<boolean>(false);

    const changeExpand = (event: SyntheticEvent, expanded: boolean) => {
        // event.stopPropagation();
        if (expanded) refToolTip.current?.hide();
        setIsExpand(expanded);
    };

    useEffect(() => {
        (async () => {
            if (isExpand) {
                await getMeetingAudioFx({ userTemplateId: id });
            }
        })();
    }, [isExpand]);

    const handleTogglePlayAll = (event: SyntheticEvent) => {
        event.stopPropagation();
        toggleMeetingAudioEvent();
    };

    return (
        <CustomTooltip
            title={
                !isExpand && isAnimation ? (
                    <Translation
                        nameSpace="meeting"
                        translation="manageAudio.text"
                    />
                ) : (
                    ''
                )
            }
            placement="right"
            disableHoverListener={isExpand}
            ref={refToolTip}
        >
            <CustomPaper
                className={clsx(styles.commonOpenPanel, {
                    [styles.expanded]: isExpand,
                })}
                variant="black-glass"
            >
                <Accordion
                    expanded={isExpand}
                    onChange={changeExpand}
                    className={clsx(styles.accordion)}
                    TransitionProps={{
                        timeout: {
                            appear: 600,
                            enter: 700,
                            exit: 500,
                        },
                        onExited: () => setIsAnimation(true),
                        onEntered: () => setIsAnimation(false),
                    }}
                >
                    <AccordionSummary
                        className={styles.summary}
                        classes={{
                            content: clsx(styles.content, {
                                [styles.expanded]: isExpand,
                            }),
                        }}
                    >
                        <CustomBox
                            display="flex"
                            className={styles.headers}
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="flex-start"
                        >
                            <CustomBox color="white" height={20}>
                                <MusicIcon width="22px" height="22px" />
                            </CustomBox>
                            <ConditionalRender condition={isExpand}>
                                <CustomTypography
                                    nameSpace="meeting"
                                    translation="manageAudio.text"
                                    color="colors.white.primary"
                                    variant="h4bold"
                                    flex={1}
                                    paddingLeft={1}
                                    fontSize="15px"
                                />
                                <CustomBox
                                    onClick={handleTogglePlayAll}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    {isPlayAll ? (
                                        <PauseIcon
                                            width="22px"
                                            height="22px"
                                            className={styles.pauseAction}
                                        />
                                    ) : (
                                        <PlayIcon
                                            width="22px"
                                            height="22px"
                                            className={styles.pauseAction}
                                        />
                                    )}
                                </CustomBox>

                                <RoundCloseIcon
                                    className={styles.closeIcon}
                                    isActive
                                    width="22px"
                                    height="22px"
                                />
                            </ConditionalRender>
                        </CustomBox>
                    </AccordionSummary>
                    <AccordionDetails classes={{ root: styles.detail }}>
                        <CustomGrid
                            container
                            flex={1}
                            paddingTop={1}
                            paddingLeft="6px"
                        >
                            <CustomScroll
                                className={clsx(styles.scroll, {
                                    [styles.disable]: !isPlayAll,
                                })}
                            >
                                {audioList.map(item => (
                                    <AudioItem
                                        key={item.key}
                                        item={item.audio}
                                    />
                                ))}
                            </CustomScroll>
                        </CustomGrid>
                    </AccordionDetails>
                </Accordion>
            </CustomPaper>
        </CustomTooltip>
    );
};
export const MeetingManageAudio = memo(Component);
