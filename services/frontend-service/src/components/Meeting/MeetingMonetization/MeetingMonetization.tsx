import { memo, useCallback, useRef, useEffect } from 'react';
import { useStore } from 'effector-react';

// icons
import { MonetizationIcon } from 'shared-frontend/icons/OtherIcons/MonetizationIcon';
import CloseIcon from '@mui/icons-material/Close';

// custom
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import IconButton from '@mui/material/IconButton';

// common
// validation
import { Translation } from '@library/common/Translation/Translation';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

// styles

// stores

// const
import { DEFAULT_PAYMENT_CURRENCY, DEFAULT_PRICE, PaymentType, StripeCurrency } from 'shared-const';
import { ValuesSwitcher } from 'shared-frontend/library/common/ValuesSwitcher';
import { ValuesSwitcherItem } from 'shared-frontend/types';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { useValueSwitcher } from 'shared-frontend/hooks/useValuesSwitcher';
import { isMobile } from 'shared-utils';
import { MeetingConnectStripe } from '../MeetingConnectStripe/MeetingConnectStripe';
import {
    $paymentMeetingAudience,
    $paymentMeetingParticipant,
    $paymentPaywallAudience,
    $paymentPaywallParticipant,
    updatePaymentMeetingEvent,
    setCreateRoomPaymentDataEvent,
    createMeetingPaymentEvent
} from '../../../store/roomStores';
import { $isConnectedStripe, addNotificationEvent } from '../../../store';
import styles from './MeetingMonetization.module.scss';
import { MeetingMonezationForm } from './MeetingMonezationForm';
import { FormDataPayment, TabsValues } from './type';
import { MeetingRole } from 'shared-types';
import { MeetingPayment, PaymentItem } from 'src/store/roomStores/meeting/meetingPayment/type';
import { NotificationType } from 'src/store/types';

enum TabsLabels {
    Participants = 'Participants',
    Audience = 'Audience',
}

type ValuesSwitcherAlias = ValuesSwitcherItem<TabsValues, TabsLabels>;

const tabs: ValuesSwitcherAlias[] = [
    {
        id: 1,
        value: TabsValues.Participants,
        label: TabsLabels.Participants,
        tooltip: (
            <CustomGrid
                display="flex"
                flexDirection="column"
                bgcolor="black"
                color="white"
                padding="5px"
                paddingTop="10px"
                borderRadius="16px"
                alignItems="center"
            >
                <span style={{ textAlign: 'center' }}>
                    Participants (10 Max)
                </span>
                <ul className={styles.tooltipList}>
                    <li>
                        <span>Are Seen & Heard</span>
                    </li>
                    <li>
                        <span>Can Chat on Sidebar</span>
                    </li>
                    <li>
                        <span>Post Sticky Notes</span>
                    </li>
                    <li>
                        <span>Visit your Links</span>
                    </li>
                </ul>
            </CustomGrid>
        ),
        tooltipClassName: styles.tooltipSwitch,
        tooltipPlacement: 'top',
    },
    {
        id: 2,
        value: TabsValues.Audience,
        label: TabsLabels.Audience,
        tooltip: (
            <CustomGrid
                display="flex"
                flexDirection="column"
                bgcolor="black"
                color="white"
                padding="5px"
                paddingTop="10px"
                borderRadius="16px"
                alignItems="center"
            >
                <span style={{ textAlign: 'center' }}>Audience (1000 Max)</span>
                <ul className={styles.tooltipList}>
                    <li>
                        <span>Can View & Hear</span>
                    </li>
                    <li>
                        <span>Can Chat on Sidebar</span>
                    </li>
                    <li>
                        <span>
                            Post Sticky Notes <small>(members)</small>
                        </span>
                    </li>
                    <li>
                        <span>Visit your Links</span>
                    </li>
                </ul>
            </CustomGrid>
        ),
        tooltipClassName: styles.tooltipSwitch,
        tooltipPlacement: 'top',
    },
];

const Component = ({ isRoomCreate = false, onUpdate = () => {} }: { isRoomCreate: boolean, onUpdate: () => void }) => {
    const buttonSaveRef = useRef<HTMLButtonElement | null>(null);
    const formParticipantsRef = useRef<{ getValues: () => FormDataPayment }>(
        null,
    );
    const formAudienceRef = useRef<{ getValues: () => FormDataPayment }>(null);

    const paymentMeetingParticipant = useStore($paymentMeetingParticipant);
    const paymentPaywallParticipant = useStore($paymentPaywallParticipant);
    const paymentMeetingAudience = useStore($paymentMeetingAudience);
    const paymentPaywallAudience = useStore($paymentPaywallAudience);
    const isConnectedStripe = useStore($isConnectedStripe);

    const { activeItem, onValueChange } = useValueSwitcher<
        TabsValues,
        TabsLabels
    >({
        values: tabs,
        initialValue: tabs[0].value,
    });

    useEffect(() => {
        if (isRoomCreate) {
            const backdropElement = document.querySelector('.MuiBackdrop-root');

            if (backdropElement) {
                backdropElement.style.display = 'none';
            }
        }
    }, []);

    const onSubmit = useCallback(async (event) => {
        event.preventDefault();
        const paymentParticipant = formParticipantsRef.current?.getValues();
        const paymentAudience = formAudienceRef.current?.getValues();
        const payload = {
            meeting: {
                participant: {
                    enabled: paymentParticipant?.enabledMeeting ?? false,
                    price: paymentParticipant?.templatePrice ?? DEFAULT_PRICE.participant,
                    currency:
                        paymentParticipant?.templateCurrency ??
                        DEFAULT_PAYMENT_CURRENCY,
                },
                audience: {
                    enabled: paymentAudience?.enabledMeeting ?? false,
                    price: paymentAudience?.templatePrice ?? DEFAULT_PRICE.audience,
                    currency:
                        paymentAudience?.templateCurrency ??
                        DEFAULT_PAYMENT_CURRENCY,
                },
            },
            paywall: {
                participant: {
                    enabled: paymentParticipant?.enabledPaywall ?? false,
                    price: paymentParticipant?.paywallPrice ?? DEFAULT_PRICE.participant,
                    currency:
                        paymentParticipant?.paywallCurrency ??
                        DEFAULT_PAYMENT_CURRENCY,
                },
                audience: {
                    enabled: paymentAudience?.enabledPaywall ?? false,
                    price: paymentAudience?.paywallPrice ?? DEFAULT_PRICE.audience,
                    currency:
                        paymentAudience?.paywallCurrency ??
                        DEFAULT_PAYMENT_CURRENCY,
                },
            },
        };
        if (!isRoomCreate) {
            updatePaymentMeetingEvent({
                ...payload
            });
            onUpdate?.();
        } else {
            // Helper function to create PaymentItem objects
            const createPaymentItem = (
                enabled: boolean,
                price: number,
                currency: StripeCurrency,
                type: PaymentType,
                meetingRole: MeetingRole
            ): PaymentItem => {
                return {
                    enabled, // from PaymentBase
                    price, // from PaymentBase
                    currency, // from PaymentBase
                    type, // additional property for PaymentItem
                    meetingRole, // additional property for PaymentItem
                };
            };

            const { participant, audience } = payload.meeting;
            const paymentItems: MeetingPayment = [];

            // Assuming PaymentType and MeetingRole enums are defined to match your use case
            if (participant.enabled) {
                paymentItems.push(createPaymentItem(participant.enabled, participant.price, participant.currency, PaymentType.Meeting, MeetingRole.Participant));
            }
            if (audience.enabled) {
                paymentItems.push(createPaymentItem(audience.enabled, audience.price, audience.currency, PaymentType.Meeting, MeetingRole.Audience));
            }

            // Repeat for the paywall part if needed, adjust type accordingly
            const { participant: paywallParticipant, audience: paywallAudience } = payload.paywall;

            if (paywallParticipant.enabled) {
                paymentItems.push(createPaymentItem(paywallParticipant.enabled, paywallParticipant.price, paywallParticipant.currency, PaymentType.Paywall, MeetingRole.Participant));
            }
            if (paywallAudience.enabled) {
                paymentItems.push(createPaymentItem(paywallAudience.enabled, paywallAudience.price, paywallAudience.currency, PaymentType.Paywall, MeetingRole.Audience));
            }

            // Now paymentItems is an array of PaymentItem, matching the expected MeetingPayment type
            createMeetingPaymentEvent(paymentItems);
            setCreateRoomPaymentDataEvent({
                ...payload
            });
            
            addNotificationEvent({
                type: NotificationType.PaymentSuccess,
                message: 'meeting.monetization.saved',
                withSuccessIcon: true
            });
        }
    }, []);

    const handleFocusInput = () => {
        buttonSaveRef.current?.classList.add(styles.animate);
    };

    const handleEndAnimation = () => {
        buttonSaveRef.current?.classList.remove(styles.animate);
    };

    const handleValueChange = (value: any) => {
        onValueChange(value);
    };

    return (
        <>
            {
                isRoomCreate &&
                <IconButton className={styles.closeIconBtn} onClick={() => onUpdate?.()}>
                    <CloseIcon className={styles.closeIcon} />
                </IconButton>
            }
            <CustomGrid
                container
                columnGap={4}
                direction="row"
                alignItems="center"
                marginBottom={2}
                maxWidth={isMobile() ? undefined : '340px'}
                minWidth={isMobile() ? undefined : '340px'}
            >
                <CustomGrid
                    display="flex"
                    alignItems="center"
                    color="colors.white.primary"
                    flex={1}
                >
                    <MonetizationIcon width="24px" height="24px" />
                    <CustomTypography
                        translation="features.monetization"
                        nameSpace="meeting"
                    />
                </CustomGrid>
                <CustomBox>
                    <MeetingConnectStripe />
                </CustomBox>
            </CustomGrid>
            <CustomGrid container direction="column" wrap="nowrap" gap={3}>
                <CustomPaper variant="black-glass" className={styles.paper}>
                    <ValuesSwitcher<TabsValues, TabsLabels>
                        values={tabs}
                        activeValue={activeItem}
                        onValueChanged={handleValueChange}
                        variant="transparent"
                        itemClassName={styles.switchItem}
                        className={styles.switcherWrapper}
                    />
                </CustomPaper>

                <MeetingMonezationForm
                    enableForm={activeItem.value === TabsValues.Participants}
                    paymentMeeting={paymentMeetingParticipant}
                    paymentPaywall={paymentPaywallParticipant}
                    onFocusInput={handleFocusInput}
                    activeValue={activeItem.value}
                    ref={formParticipantsRef}
                />
                <MeetingMonezationForm
                    enableForm={activeItem.value === TabsValues.Audience}
                    paymentMeeting={paymentMeetingAudience}
                    paymentPaywall={paymentPaywallAudience}
                    onFocusInput={handleFocusInput}
                    activeValue={activeItem.value}
                    ref={formAudienceRef}
                />
                <CustomButton
                    type="submit"
                    className={styles.button}
                    disabled={!isConnectedStripe}
                    label={
                        <Translation
                            nameSpace="common"
                            translation="buttons.save"
                        />
                    }
                    typographyProps={{ fontSize: 14 }}
                    ref={buttonSaveRef}
                    id="buttonSubmit"
                    onAnimationEnd={handleEndAnimation}
                    onClick={onSubmit}
                />
            </CustomGrid>
        </>
    );
};

export const MeetingMonetization = memo(Component);
