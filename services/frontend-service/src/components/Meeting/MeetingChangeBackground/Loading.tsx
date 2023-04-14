import { CircularProgress } from '@mui/material';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import styles from './MeetingChangeBackground.module.scss';

export const Loading = () => {
    return (
        <CustomGrid className={styles.container}>
            <CustomBox
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
            >
                <CircularProgress />
            </CustomBox>
        </CustomGrid>
    );
};
