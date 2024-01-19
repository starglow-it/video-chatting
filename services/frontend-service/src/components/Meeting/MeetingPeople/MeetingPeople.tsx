import { useStore } from 'effector-react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ReactNode } from 'react';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { $isPortraitLayout } from 'src/store';
import { isMobile } from 'shared-utils';

import styles from './MeetingPeople.module.scss';
import { MeetingChat } from '../MeetingChat/MeetingChat';
import { Typography } from '@mui/material';

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
    return (
        <CustomGrid
            display="flex"
            flexDirection="column"
            height={isMobile() && !isPortraitLayout ? '250px' : '400px'}
        >
            <Typography variant="body1" className={styles.chatCaption}>Chat</Typography>
            <MeetingChat />
        </CustomGrid>
    );
};
