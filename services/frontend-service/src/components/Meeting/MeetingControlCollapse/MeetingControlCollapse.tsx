import { SpeedDial, SpeedDialAction } from '@mui/material';
import { useStore } from 'effector-react';
import { memo } from 'react';
import { EllipsisIcon } from 'shared-frontend/icons/OtherIcons/EllipsisIcon';
import { MonetizationIcon } from 'shared-frontend/icons/OtherIcons/MonetizationIcon';
import { SettingsIcon } from 'shared-frontend/icons/OtherIcons/SettingsIcon';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { $profileStore, appDialogsApi } from 'src/store';
import {
    $isOwner,
    $isTogglePayment,
    $meetingTemplateStore,
    $paymentIntent,
    cancelPaymentIntentWithData,
    createPaymentIntentWithData,
    togglePaymentFormEvent,
} from 'src/store/roomStores';
import { AppDialogsEnum } from 'src/store/types';
import styles from './MeetingControlCollapse.module.scss';

const ACTIONS = [
    {
        icon: <SettingsIcon width="22px" height="22px" />,
        name: 'Save',
        type: 'openSetting',
    },
    {
        icon: <MonetizationIcon width="22px" height="22px" />,
        name: 'Copy',
        type: 'openPayment',
    },
];

const Component = () => {
    const isOwner = useStore($isOwner);
    const profile = useStore($profileStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isCreatePaymentIntentPending = useStore(
        createPaymentIntentWithData.pending,
    );
    const isPaymentOpen = useStore($isTogglePayment);
    const paymentIntent = useStore($paymentIntent);

    const handleTogglePayment = () => {
        if (!isPaymentOpen && !paymentIntent?.id && !isOwner) {
            createPaymentIntentWithData();
        }

        if (paymentIntent?.id) {
            cancelPaymentIntentWithData();
        }
        togglePaymentFormEvent();
    };

    const handleActions = (action: string) => {
        switch (action) {
            case 'openSetting':
                appDialogsApi.openDialog({
                    dialogKey: AppDialogsEnum.devicesSettingsDialog,
                });
                break;
            case 'openPayment':
                if (!isCreatePaymentIntentPending) handleTogglePayment();
                break;
            default:
                break;
        }
    };

    return (
        <CustomGrid container className={styles.controlCollapse}>
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                icon={<EllipsisIcon width="22px" height="22px" />}
                classes={{ root: styles.root, fab: styles.root }}
            >
                {ACTIONS.map(action => {
                    if (action.type === 'openSetting' && !isOwner) return null;
                    if (
                        action.type === 'openPayment' &&
                        (isOwner
                            ? !(
                                  profile.isStripeEnabled &&
                                  profile.stripeAccountId
                              )
                            : !meetingTemplate.isMonetizationEnabled)
                    )
                        return null;
                    return (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={() => handleActions(action.type)}
                            classes={{ fab: styles.root }}
                        />
                    );
                })}
            </SpeedDial>
        </CustomGrid>
    );
};
export const MeetingControlCollapse = memo(Component);
