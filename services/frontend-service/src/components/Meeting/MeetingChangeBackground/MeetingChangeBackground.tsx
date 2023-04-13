import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    ClickAwayListener,
} from '@mui/material';
import clsx from 'clsx';
import { useStore } from 'effector-react';
import { memo, useEffect, useState } from 'react';
import { ImageIcon } from 'shared-frontend/icons/OtherIcons/ImageIcon';
import { RoundCloseIcon } from 'shared-frontend/icons/RoundIcons/RoundCloseIcon';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import {
    $backgroundMeetingStore,
    $isLoadMoreMediasStore,
    setCategoryEvent,
    setMediaEvent,
    setQueryMediasEvent,
} from '../../../store/roomStores';
import { Barge } from './Barge';
import { Media } from './Media';
import styles from './MeetingChangeBackground.module.scss';
import { UploadBackground } from './Upload';

const Component = () => {
    const { medias, categorySelected, mediaSelected, categories, count } =
        useStore($backgroundMeetingStore);
    const isLoadMore = useStore($isLoadMoreMediasStore);

    const [isExpand, setIsExpand] = useState<boolean>(false);

    useEffect(() => {
        if (isExpand && categories.length && !categorySelected)
            setCategoryEvent({
                categorySelected: categories[0].id,
            });
    }, [isExpand]);

    const handleSelectBackground = (id: string) => {
        setMediaEvent({ mediaSelected: id });
    };

    const handleSelectType = (id: string) => {
        setCategoryEvent({ categorySelected: id });
    };

    const handleScrollEnd = () => {
        console.log('end')
        // if (!isLoadMore && medias.length < count) setQueryMediasEvent();
    };

    const changeExpand = (event: React.SyntheticEvent, expanded: boolean) => {
        setIsExpand(expanded);
    };

    return (
        <ClickAwayListener onClickAway={() => setIsExpand(false)}>
            <CustomPaper
                className={clsx(styles.commonOpenPanel, {
                    [styles.expanded]: isExpand,
                })}
            >
                <Accordion
                    expanded={isExpand}
                    onChange={changeExpand}
                    className={clsx(styles.accordion)}
                    TransitionProps={{ timeout: {
                        appear: 600,
                        enter: 100,
                        exit: 500
                    } }}
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
                            <CustomBox color="white" height={18}>
                                <ImageIcon width="16px" height="16px" />
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

                                <RoundCloseIcon
                                    className={styles.closeIcon}
                                    isActive
                                    width="22px"
                                    height="22px"
                                />
                            </ConditionalRender>
                        </CustomBox>
                    </AccordionSummary>
                    <AccordionDetails classes={{root: styles.detail}}>
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
                            flex={75}
                            paddingTop={3}
                            paddingLeft="6px"
                        >
                            <ConditionalRender condition={medias.length > 0}>
                                <CustomScroll
                                    className={styles.scroll}
                                    onYReachEnd={handleScrollEnd}
                                >
                                    <UploadBackground />
                                    {medias.map(item => (
                                        <Media
                                            key={item.id}
                                            isActive={item.id === mediaSelected}
                                            item={item}
                                            onSelect={handleSelectBackground}
                                        />
                                    ))}
                                </CustomScroll>
                            </ConditionalRender>
                        </CustomGrid>
                    </AccordionDetails>
                </Accordion>
            </CustomPaper>
        </ClickAwayListener>
    );
};

export const MeetingChangeBackground = memo(Component);
