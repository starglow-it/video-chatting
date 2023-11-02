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
    deleteMediaMeetingFx,
    setCategoryEvent,
    setMediaEvent,
    setQueryMediasEvent,
    uploadNewBackgroundFx,
} from '../../../store/roomStores';
import { MeetingYoutubeControl } from '../MeetingYoutubeControl/MeetingYoutubeControl';

const Component = () => {
    const { medias, categorySelected, mediaSelected, categories, count } =
        useStore($backgroundMeetingStore);
    const isLoadMore = useStore($isLoadMoreMediasStore);
    const isLoading = useStore(uploadNewBackgroundFx.pending);
    const { isMobile } = useBrowserDetect();
    const isChangeBackgroundOpen = useStore($isToggleBackgroundPanel);

    const [isExpand, setIsExpand] = useState<boolean>(
        isMobile ? isChangeBackgroundOpen : true,
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
                className={clsx(styles.commonOpenPanel, {
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
                    {isLoading && <LinearProgress color="secondary" />}
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
                            <CustomBox color="white" height={18}>
                                <ImageIcon width="22px" height="20px" />
                            </CustomBox>
                            <ConditionalRender condition={isExpand}>
                                <CustomTypography
                                    nameSpace="meeting"
                                    translation="changeBackground.text"
                                    color="colors.white.primary"
                                    variant="h4bold"
                                    flex={1}
                                    paddingLeft={1}
                                    fontSize="15px"
                                />

                                <ConditionalRender condition={!isMobile}>
                                    <RoundCloseIcon
                                        className={styles.closeIcon}
                                        isActive
                                        width="22px"
                                        height="22px"
                                    />
                                </ConditionalRender>
                            </ConditionalRender>
                        </CustomBox>
                    </AccordionSummary>
                    <AccordionDetails classes={{ root: styles.detail }}>
                        <CustomBox
                            flex={25}
                            display="flex"
                            flexDirection="row"
                            flexWrap="wrap"
                            paddingTop={1}
                        >
                            {categories.map(item => (
                                <Barge
                                    key={item.key}
                                    isActive={item.id === categorySelected}
                                    onSelect={handleSelectType}
                                    item={item}
                                />
                            ))}
                        </CustomBox>

                        <CustomGrid
                            container
                            flex={1}
                            paddingTop={3}
                            paddingLeft="6px"
                        >
                            <ConditionalRender condition={medias.length > 0}>
                                <CustomScroll
                                    className={clsx(styles.scroll, {
                                        [styles.mobile]: isMobile,
                                    })}
                                    onYReachEnd={handleScrollEnd}
                                    containerRef={el =>
                                        (refScroll.current = el)
                                    }
                                >
                                    <ConditionalRender
                                        condition={!isHideUpload}
                                    >
                                        <UploadBackground />
                                    </ConditionalRender>
                                    {medias.map(item => (
                                        <Media
                                            key={item.id}
                                            isActive={item.id === mediaSelected}
                                            item={item}
                                            onSelect={handleSelectBackground}
                                            onDelete={handleDeleteMedia}
                                            isShowDelete={!isHideUpload}
                                        />
                                    ))}
                                </CustomScroll>
                            </ConditionalRender>
                        </CustomGrid>
                        <ConditionalRender condition={!isMobile}>
                            <MeetingYoutubeControl />
                        </ConditionalRender>
                    </AccordionDetails>
                </Accordion>
            </CustomPaper>
        </CustomTooltip>
    );
};

export const MeetingChangeBackground = memo(Component);
