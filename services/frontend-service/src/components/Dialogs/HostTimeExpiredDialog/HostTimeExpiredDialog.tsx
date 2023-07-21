import { memo } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

// custom
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { WarningIcon } from 'shared-frontend/icons/OtherIcons/WarningIcon';

// styles
import { Translation } from '@library/common/Translation/Translation';
import styles from './HostTimeExpiredDialog.module.scss';

// stores
import { $appDialogsStore, $authStore, appDialogsApi } from '../../../store';

// types
import { AppDialogsEnum } from '../../../store/types';

// const
import { dashboardRoute, loginRoute } from '../../../const/client-routes';

const Component = () => {
    const router = useRouter();

    const { hostTimeExpiredDialog } = useStore($appDialogsStore);
    const { isWithoutAuthen } = useStore($authStore);

    const handleClose = () => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.hostTimeExpiredDialog,
        });
        router.push(isWithoutAuthen ? loginRoute : dashboardRoute);
    };

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={hostTimeExpiredDialog}
            onClose={handleClose}
        >
            <CustomGrid container alignItems="center" direction="column">
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="center"
                >
                    <WarningIcon
                        className={styles.icon}
                        width="36px"
                        height="36px"
                    />
                    <CustomTypography
                        variant="h3bold"
                        nameSpace="meeting"
                        translation="expired.title"
                    />
                </CustomGrid>

                <CustomTypography
                    textAlign="center"
                    nameSpace="meeting"
                    translation="expired.text"
                />

                <CustomButton
                    onClick={handleClose}
                    label={
                        <Translation
                            nameSpace="meeting"
                            translation="expired.button"
                        />
                    }
                    className={styles.button}
                    variant="custom-cancel"
                />
            </CustomGrid>
        </CustomDialog>
    );
};

export const HostTimeExpiredDialog = memo(Component);
