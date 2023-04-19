import { memo, useState } from 'react';
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
import styles from './MeetingManageAudio.module.scss';
import { AudioItem } from './AudioItem';

const Component = () => {
    const [isExpand, setIsExpand] = useState<boolean>(true);

    const changeExpand = (event: React.SyntheticEvent, expanded: boolean) => {
        setIsExpand(expanded);
    };

    const handleScrollEnd = () => {};

    return (
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
                            className={styles.scroll}
                            onYReachEnd={handleScrollEnd}
                        >
                            {[1, 2, 3, 4].map(item => (
                                <AudioItem key={item} />
                            ))}
                        </CustomScroll>
                    </CustomGrid>
                </AccordionDetails>
            </Accordion>
        </CustomPaper>
    );
};
export const MeetingManageAudio = memo(Component);
