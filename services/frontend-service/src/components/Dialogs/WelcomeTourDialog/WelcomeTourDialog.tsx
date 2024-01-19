import { memo, useCallback } from 'react';
import { useStore } from 'effector-react';
import clsx from "clsx";

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';

import { useBrowserDetect } from '@hooks/useBrowserDetect';
import { Typography } from '@mui/material';

// stores
import { Translation } from '@library/common/Translation/Translation';
import {
    $profileStore,
    emitDashboardJoyrideEvent
} from '../../../store';

// styles
import styles from './WelcomeTourDialog.module.scss';

const Component = ({ isFirstDashboardVisit, handleSetVisitedDashboard }: {isFirstDashboardVisit: boolean, handleSetVisitedDashboard:(data:boolean) => void}) => {
    const { isMobile } = useBrowserDetect();
    const profile = useStore($profileStore);

    const handleCloseWelcomeTourDialog = useCallback(() => {
        handleSetVisitedDashboard(false);
        emitDashboardJoyrideEvent({ runDashboardJoyride: true });
    }, []);

    return (
        <CustomDialog
            contentClassName={clsx(styles.content, { [styles.contentMobile]: isMobile, [styles.contentNoMobile]: !isMobile })}
            className={styles.wrapper}
            open={isFirstDashboardVisit && !isMobile}
        >
            <CustomGrid
                container
                direction="column"
                alignItems="center"
                wrap="nowrap"
                gap={5}
            >
                <Typography variant="h4" className={styles.welcomeCaption}>👋 Welcome to Ruume, { profile.fullName }! 👋</Typography>
                <CustomTypography
                    variant="h4"
                    textAlign="center"
                    nameSpace="templates"
                    translation="welcomeTour.title"
                />
                <CustomGrid container gap={2} wrap="nowrap" className={styles.actionBtnWrapper}>
                    <CustomButton
                        label={
                            <Translation
                                nameSpace="common"
                                translation="buttons.letsgo"
                            />
                        }
                        variant="custom-cancel"
                        onClick={handleCloseWelcomeTourDialog}
                        className={styles.actionBtn}
                    />
                    
                </CustomGrid>
            </CustomGrid>
        </CustomDialog>
    );
};

export const WelcomeTourDialog = memo(Component);
