import { CustomTooltip } from "@library/custom/CustomTooltip/CustomTooltip"
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper'
import { ActionButton } from "shared-frontend/library/common/ActionButton"
import { useStore } from "effector-react"
import { MouseEvent, SyntheticEvent, useCallback, useState } from "react"
import { MonetizationIcon } from "shared-frontend/icons/OtherIcons/MonetizationIcon"
import { ConditionalRender } from "shared-frontend/library/common/ConditionalRender"
import { CustomPopover } from "@library/custom/CustomPopover/CustomPopover"
import clsx from "clsx"
import { PaymentForm } from "@components/PaymentForm/PaymentForm"
import styles from './MeetingMonetization.module.scss'
import {
  $profileStore
} from '../../../store';
import {
  $isTogglePayment,
  $paymentIntent,
  $isOwner,
  $meetingTemplateStore,
  cancelPaymentIntentWithData,
  createPaymentIntentWithData,
  togglePaymentFormEvent,

} from '../../../store/roomStores';
import { MeetingMonetization } from "./MeetingMonetization"

export const MeetingMonetizationButton = () => {
  const paymentIntent = useStore($paymentIntent);
  const profile = useStore($profileStore);
  const meetingTemplate = useStore($meetingTemplateStore);
  const isOwner = useStore($isOwner);
  const intentId = paymentIntent?.id;
  const isPaymentOpen = useStore($isTogglePayment);
  const isCreatePaymentIntentPending = useStore(
    createPaymentIntentWithData.pending,
);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleTogglePayments = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(anchorEl ? null : e.currentTarget);
    if (!isCreatePaymentIntentPending) {
        if (!isPaymentOpen && !intentId && !isOwner) {
            createPaymentIntentWithData();
        }
        if (intentId) cancelPaymentIntentWithData();
        togglePaymentFormEvent();
    }
  };
  const conditionRender = (
    isOwner
    ? Boolean(
          profile.isStripeEnabled &&
              profile.stripeAccountId,
      )
    : meetingTemplate.isMonetizationEnabled
  )

  const handleClosePayment = useCallback(async () => {
    setAnchorEl(null)
    if (paymentIntent?.id) {
        cancelPaymentIntentWithData();
    }
    togglePaymentFormEvent();
}, [paymentIntent?.id]);

const handleUpdateMonetization = useCallback(() => {
    setAnchorEl(null)
    togglePaymentFormEvent();
}, []);

  return (
    <ConditionalRender
        condition
    >
      <CustomPaper
        variant="black-glass"
        className={styles.deviceButton}
        aria-describedby='monetization'
      >
        <ActionButton
          variant="transparentBlack"
          onAction={handleTogglePayments}
          Icon={<MonetizationIcon width="22px" height="22px" />}          
          style={{
            borderRadius: 12
          }}
        />
          
      </CustomPaper> 
      <CustomPopover
        id='monetization'
        open={isPaymentOpen}
        onClose={handleClosePayment}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
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
  )
}