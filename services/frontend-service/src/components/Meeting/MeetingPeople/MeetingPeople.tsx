import { useStore, useStoreMap } from 'effector-react';
import {
    $activeTabPanel,
    $isLurker,
    $isMeetingHostStore,
    $meetingUsersStore,
    resetHaveNewMessageEvent,
    setActiveTabPanelEvent,
} from 'src/store/roomStores';
import Tab from '@mui/material/Tab';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ReactNode, useCallback } from 'react';
import { Tabs } from '@mui/material';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { MeetingAccessStatusEnum, MeetingRole } from 'shared-types';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { MeetingUsersList } from '../MeetingUsersList/MeetingUsersList';
import { MeetingAccessRequests } from '../MeetingAccessRequests/MeetingAccessRequests';

import styles from './MeetingPeople.module.scss';
import { MeetingLurkers } from '../MeetingLurkers/MeetingLurkers';
import { MeetingChat } from '../MeetingChat/MeetingChat';

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
    const isMeetingHost = useStore($isMeetingHostStore);
    const isLurker = useStore($isLurker);

    const participants = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state =>
            state.filter(
                user =>
                    user.accessStatus === MeetingAccessStatusEnum.InMeeting &&
                    user.meetingRole !== MeetingRole.Lurker,
            ),
    });

    const lurkers = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state =>
            state.filter(
                user =>
                    user.accessStatus === MeetingAccessStatusEnum.InMeeting &&
                    user.meetingRole === MeetingRole.Lurker,
            ),
    });

    const value = useStore($activeTabPanel);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTabPanelEvent(newValue);
    };

    const handleResetNewMessage = (tab: string) => {
        if (tab === 'Chat') {
            resetHaveNewMessageEvent();
        }
    };

    const a11yProps = useCallback((index: number) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }, []);

    const tabs = !isLurker
        ? [
              !participants.length
                  ? 'Participants'
                  : `Participants(${participants.length})`,
              !lurkers.length ? 'Audience' : `Audience(${lurkers.length})`,
              'Chat',
          ]
        : ['Chat'];

    return (
        <CustomGrid display="flex" flexDirection="column" height="400px">
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="lab API tabs example"
                classes={{ root: styles.tabs }}
            >
                {tabs.map((tab, index) => (
                    <Tab
                        key={tab}
                        label={tab}
                        value={index}
                        {...a11yProps(index)}
                        classes={{ root: styles.tab }}
                        onClick={() => handleResetNewMessage(tab)}
                    />
                ))}
            </Tabs>
            <ConditionalRender condition={!isLurker}>
                <CustomTabPanel value={value} index={0}>
                    <CustomGrid
                        display="flex"
                        flexDirection="column"
                        paddingTop={1}
                    >
                        {isMeetingHost && <MeetingAccessRequests />}
                        <MeetingUsersList />
                    </CustomGrid>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <CustomGrid
                        display="flex"
                        flexDirection="column"
                        paddingTop={1}
                    >
                        <MeetingLurkers />
                    </CustomGrid>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    <MeetingChat />
                </CustomTabPanel>
            </ConditionalRender>
            <ConditionalRender condition={isLurker}>
                <CustomTabPanel value={value} index={0}>
                    <MeetingChat />
                </CustomTabPanel>
            </ConditionalRender>
        </CustomGrid>
    );
};
