import { memo, useCallback } from 'react';
import { useStore } from 'effector-react';
import clsx from "clsx";

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

import { useBrowserDetect } from '@hooks/useBrowserDetect';
import IconButton from '@mui/material/IconButton';
import { Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// stores
import {
    $appDialogsStore,
    appDialogsApi
} from '../../../store';
import { AppDialogsEnum } from '../../../store/types';

// styles
import styles from './MobilePopUpDialog.module.scss';

const Component = () => {
    const { isMobile } = useBrowserDetect();
    const { mobilePopUpDialog } = useStore($appDialogsStore);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.mobilePopUpDialog,
        });
    }, []);

    return (
        <CustomDialog
            contentClassName={clsx(styles.content, { [styles.contentMobile]: isMobile, [styles.contentNoMobile]: !isMobile })}
            className={styles.wrapper}
            open={mobilePopUpDialog && isMobile}
        >
            <IconButton aria-label="close" size="small" disableFocusRipple={true} className={styles.closeBtn} onClick={handleClose} >
                <CloseIcon />
            </IconButton>
            <CustomGrid
                container
                direction="column"
                alignItems="center"
                wrap="nowrap"
                gap={5}
            >
                <Typography className={styles.headerText}>thinking about hosting a ruume on mobile?</Typography>
                <Typography className={styles.imageText}>🚧</Typography>
                <CustomBox>
                    <Typography className={styles.bodyText}>hosting on mobile is currently being optimized. 🛠️</Typography>
                    <Typography className={styles.bodyText}>don't mind a minor feature glitch? proceed! ➡️</Typography>
                </CustomBox>
                <CustomGrid
                    item
                    container
                    justifyContent='flex-start'
                >
                    <CustomGrid
                        item
                        xs={2}
                    >
                        <Typography className={styles.footerImageText}>👍</Typography>
                    </CustomGrid>
                    <CustomGrid item xs={10}>
                        <Typography className={styles.footerText}>we highly recommend hosting on desktop for the best experience.</Typography>
                    </CustomGrid>
                </CustomGrid>
            </CustomGrid>
        </CustomDialog>
    );
};

export const MobilePopUpDialog = memo(Component);
