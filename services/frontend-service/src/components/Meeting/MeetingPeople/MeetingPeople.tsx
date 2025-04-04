import { useStore } from 'effector-react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ReactNode, useCallback, useEffect } from 'react';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { $isPortraitLayout } from 'src/store';
import { isMobile } from 'shared-utils';
import clsx from 'clsx';

import styles from './MeetingPeople.module.scss';
import { MeetingChat } from '../MeetingChat/MeetingChat';
import { Tab, Tabs } from '@mui/material';
import {
    $activeTabPanel,
    $isAudience,
    $isHaveNewMessage,
    $isHaveNewQuestion,
    resetHaveNewMessageEvent,
    resetHaveNewQuestionEvent,
    setActiveTabPanelEvent,
    toggleUsersPanelEvent
} from 'src/store/roomStores';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { MeetingQuestionAnswer } from '../MeetingQuestionAnswer/MeetingQuestionAnswer';
import { MeetingTranscribe } from '../MeetingChat/MeetingTranscribe';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

interface TabPanelProps {
    children: ReactNode;
    index: number;
    value: number;
}

export const CustomTabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style={{ height: '100%' }}
            {...other}
        >
            {value === index && (
                <CustomBox
                    sx={{
                        padding: value === 2 ? '8px 0px' : '8px',
                        height: '100%',
                    }}
                >
                    {children}
                </CustomBox>
            )}
        </div>
    );
};

export const MeetingPeople = () => {
    const isPortraitLayout = useStore($isPortraitLayout);
    const isAudience = useStore($isAudience);
    const value = useStore($activeTabPanel);
    const isThereNewMessage = useStore($isHaveNewMessage);
    const isThereNewQuestion = useStore($isHaveNewQuestion);

    useEffect(() => {
        if (isThereNewMessage) {
            setActiveTabPanelEvent(0);
        }
        if (isThereNewMessage) {
            setActiveTabPanelEvent(1);
        }
    }, [isThereNewMessage, isThereNewQuestion])

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTabPanelEvent(newValue);
    };

    const handleResetNewMessage = (tab: string) => {
        if (tab === 'chat') {
            resetHaveNewMessageEvent();
        }
        if (tab === 'questions') {
            resetHaveNewQuestionEvent();
        }
    };

    const toggleOutsideUserPanel = useCallback((e: MouseEvent | TouchEvent) => {
        e.stopPropagation();
        toggleUsersPanelEvent(false);
        setActiveTabPanelEvent(0);
    }, []);

    const a11yProps = useCallback((index: number) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }, []);

    const tabs = [
        'chat',
        'questions',
        // 'transcript',
    ]

    return (
        <CustomGrid
            display="flex"
            flexDirection="column"
            height={isMobile() && !isPortraitLayout ? '250px' : '440px'}
            className={styles.wrapper}
        >
            <IconButton aria-label="close" size="small" className={styles.closeBtn} onClick={toggleOutsideUserPanel}>
                <CloseIcon />
            </IconButton>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="lab API tabs example"
                variant={isMobile() ? 'scrollable' : undefined}
                scrollButtons={isMobile()}
                allowScrollButtonsMobile={isMobile()}
                TabScrollButtonProps={{
                    classes: { root: styles.buttonScroll },
                }}
                classes={{
                    root: styles.tabs,
                }}
                sx={{
                    '& .MuiTabs-flexContainer': {
                        justifyContent: 'space-around',
                    },
                }}
            >
                {tabs.map((tab, index) => (
                    <Tab
                        key={tab}
                        label={tab}
                        value={index}
                        {...a11yProps(index)}
                        classes={{ root: clsx(styles.tab, { [styles.newRequest]: !!isThereNewQuestion && tab === 'questions' }) }}
                        onClick={() => handleResetNewMessage(tab)}
                    />
                ))}
            </Tabs>
            <ConditionalRender condition={!isAudience}>
                <CustomTabPanel value={value} index={0}>
                    <MeetingChat />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <MeetingQuestionAnswer />
                </CustomTabPanel>
                {/* <CustomTabPanel value={value} index={2}>
                    <MeetingTranscribe />
                </CustomTabPanel> */}
            </ConditionalRender>
            <ConditionalRender condition={isAudience}>
                <CustomTabPanel value={value} index={0}>
                    <MeetingChat />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <MeetingQuestionAnswer />
                </CustomTabPanel>
                {/* <CustomTabPanel value={value} index={2}>
                    <MeetingTranscribe />
                </CustomTabPanel> */}
            </ConditionalRender>
        </CustomGrid>
    );
};
