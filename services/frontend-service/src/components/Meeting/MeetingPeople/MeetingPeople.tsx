import { useStore, useStoreMap } from 'effector-react';
import { $isMeetingHostStore, $meetingUsersStore } from 'src/store/roomStores';
import Tab from '@mui/material/Tab';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ReactNode, useCallback, useState } from 'react';
import { Tabs } from '@mui/material';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { MeetingAccessStatusEnum, MeetingRole } from 'shared-types';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { MeetingUsersList } from '../MeetingUsersList/MeetingUsersList';
import { MeetingAccessRequests } from '../MeetingAccessRequests/MeetingAccessRequests';

import styles from './MeetingPeople.module.scss';
import { MeetingLurkers } from '../MeetingLurkers/MeetingLurkers';

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
            {...other}
        >
            {value === index && <CustomBox sx={{ p: 1 }}>{children}</CustomBox>}
        </div>
    );
};

export const MeetingPeople = () => {
    const isMeetingHost = useStore($isMeetingHostStore);
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

    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const a11yProps = useCallback((index: number) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }, []);

    return (
        <CustomGrid display="flex" flexDirection="column" height="400px">
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="lab API tabs example"
                classes={{ root: styles.tabs }}
            >
                <Tab
                    label={
                        !participants.length
                            ? 'Participants'
                            : `Participants(${participants.length})`
                    }
                    {...a11yProps(0)}
                    classes={{ root: styles.tab }}
                />
                <Tab
                    label={
                        !lurkers.length
                            ? 'Lurkers'
                            : `Lurkers(${lurkers.length})`
                    }
                    {...a11yProps(1)}
                    classes={{ root: styles.tab }}
                />
                <Tab
                    label="Chat"
                    {...a11yProps(2)}
                    classes={{ root: styles.tab }}
                />
            </Tabs>

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
                <CustomTypography color="white">Coming soon!</CustomTypography>
            </CustomTabPanel>
        </CustomGrid>
    );
};
