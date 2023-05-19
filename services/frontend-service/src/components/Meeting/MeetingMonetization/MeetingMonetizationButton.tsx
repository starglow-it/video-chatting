import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { useStore } from 'effector-react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { MonetizationIcon } from 'shared-frontend/icons/OtherIcons/MonetizationIcon';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomPopover } from '@library/custom/CustomPopover/CustomPopover';
import { PaymentForm } from '@components/PaymentForm/PaymentForm';
import { useToggle } from '@hooks/useToggle';
import styles from './MeetingMonetization.module.scss';
import {
    $isTogglePayment,
    $paymentIntent,
    $isOwner,
    $meetingTemplateStore,
    cancelPaymentIntentWithData,
    createPaymentIntentWithData,
    togglePaymentFormEvent,
} from '../../../store/roomStores';
import { MeetingMonetization } from './MeetingMonetization';
import { Translation } from '@library/common/Translation/Translation';
import { CustomTooltip } from 'shared-frontend/library/custom/CustomTooltip';

export const MeetingMonetizationButton = () => {
    const paymentIntent = useStore($paymentIntent);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isOwner = useStore($isOwner);
    const intentId = paymentIntent?.id;
    const isPaymentOpen = useStore($isTogglePayment);
    const isCreatePaymentIntentPending = useStore(
        createPaymentIntentWithData.pending,
    );
    const {
        value: togglePopover,
        onToggleSwitch: handleTogglePopover,
        onSetSwitch: handleSetPopover,
    } = useToggle(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleTogglePayments = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        handleTogglePopover();
        setAnchorEl(anchorEl ? null : e.currentTarget);
        if (!isCreatePaymentIntentPending) {
            if (!isPaymentOpen && !intentId && !isOwner) {
                createPaymentIntentWithData();
            }
            if (intentId) cancelPaymentIntentWithData();
            togglePaymentFormEvent();
        }
    };

    const handleClosePayment = useCallback(async () => {
        setAnchorEl(null);
        handleSetPopover(false);
        if (paymentIntent?.id) {
            cancelPaymentIntentWithData();
        }
        togglePaymentFormEvent();
    }, [paymentIntent?.id]);

    const handleUpdateMonetization = useCallback(() => {
        setAnchorEl(null);
        handleSetPopover(false);
        togglePaymentFormEvent();
    }, []);

    useEffect(() => {
        if (!isOwner) {
            handleClosePayment();
        }
    }, [
        isOwner,
        meetingTemplate?.isMonetizationEnabled,
        meetingTemplate?.templatePrice,
    ]);

    return (
        <ConditionalRender
            condition={
                isOwner ||
                (meetingTemplate.isMonetizationEnabled &&
                    !!meetingTemplate?.templatePrice)
            }
        >
            <CustomTooltip
                title={
                    <Translation
                        nameSpace="meeting"
                        translation="features.getPaid"
                    />
                }
                placement="left"
            >
                <CustomPaper
                    variant="black-glass"
                    className={styles.deviceButton}
                    aria-describedby="monetization"
                >
                    <ActionButton
                        variant="transparentBlack"
                        onAction={handleTogglePayments}
                        Icon={<MonetizationIcon width="32px" height="32px" />}
                        style={{
                            borderRadius: 12,
                        }}
                    />
                </CustomPaper>
            </CustomTooltip>
            <CustomPopover
                id="monetization"
                open={togglePopover}
                onClose={handleClosePayment}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                PaperProps={{
                    className: styles.popoverMonetization,
                }}
            >
                <CustomPaper
                    variant="black-glass"
                    className={styles.commonOpenPanel}
                >
                    <ConditionalRender condition={!isOwner}>
                        <PaymentForm onClose={handleClosePayment} />
                    </ConditionalRender>
                    <ConditionalRender condition={isOwner}>
                        <MeetingMonetization
                            onUpdate={handleUpdateMonetization}
                        />
                    </ConditionalRender>
                </CustomPaper>
            </CustomPopover>
        </ConditionalRender>
    );
};
