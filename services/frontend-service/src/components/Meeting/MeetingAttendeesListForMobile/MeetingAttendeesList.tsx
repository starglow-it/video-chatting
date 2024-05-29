import { useStore } from 'effector-react';
import clsx from 'clsx';
import {
    $isAudience,
    $isMeetingHostStore,
} from 'src/store/roomStores';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ReactNode } from 'react';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { MeetingUsersList } from '../MeetingUsersList/MeetingUsersList';
import { MeetingAccessRequests } from '../MeetingAccessRequests/MeetingAccessRequests';

import styles from './MeetingAttendeesList.module.scss';
import { MeetingAudiences } from '../MeetingAudiences/MeetingAudiences';

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

export const MeetingAttendeesListForMobile = ({ isParticipantPanelShow }: { isParticipantPanelShow: Boolean }) => {
    const isMeetingHost = useStore($isMeetingHostStore);
    const isAudience = useStore($isAudience);

    return (
        <CustomGrid
            display="flex"
            flexDirection="column"
            height="auto"
            className={styles.root}
        >
            <ConditionalRender condition={!isAudience}>
                <div className={clsx({ [styles.listPanelHidden]: !isParticipantPanelShow })}>
                    <CustomGrid
                        display="flex"
                        flexDirection="column"
                        paddingTop={1}
                    >
                        {isMeetingHost && <MeetingAccessRequests />}
                        <MeetingUsersList />
                    </CustomGrid>
                </div>
                <div className={clsx({ [styles.listPanelHidden]: isParticipantPanelShow })}>
                    <CustomGrid
                        display="flex"
                        flexDirection="column"
                        paddingTop={1}
                    >
                        <MeetingAudiences />
                    </CustomGrid>
                </div>
            </ConditionalRender >
        </CustomGrid >
    );
};
