import { memo, useCallback, useRef } from 'react';
import { useStore } from 'effector-react';

// icons
import { MonetizationIcon } from 'shared-frontend/icons/OtherIcons/MonetizationIcon';

// custom
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// common
// validation
import { Translation } from '@library/common/Translation/Translation';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

// styles
import styles from './MeetingMonetization.module.scss';

// stores
import { $isConnectedStripe } from '../../../store';
import {
    $paymentMeetingLurker,
    $paymentMeetingParticipant,
    $paymentPaywallLurker,
    $paymentPaywallParticipant,
    updatePaymentMeetingEvent,
} from '../../../store/roomStores';

// const
import { MeetingConnectStripe } from '../MeetingConnectStripe/MeetingConnectStripe';
import { DEFAULT_PAYMENT_CURRENCY } from 'shared-const';
import { ValuesSwitcher } from 'shared-frontend/library/common/ValuesSwitcher';
import { ValuesSwitcherItem } from 'shared-frontend/types';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { useValueSwitcher } from 'shared-frontend/hooks/useValuesSwitcher';
import { MeetingMonezationForm } from './MeetingMonezationForm';
import { FormDataPayment } from './type';

enum TabsValues {
    Participants = 1,
    Audience = 2,
}

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
        // tooltip: (
        //     <CustomGrid
        //         display="flex"
        //         flexDirection="column"
        //         bgcolor="black"
        //         color="white"
        //         padding={2}
        //     >
               
        //         <ul>
        //         <p>Participants (10 Max)</p>
        //             <li>
        //                 <p>Are Seen & Heard</p>
        //             </li>
        //             <li>
        //                 <p>Can Chat on Sidebar</p>
        //             </li>
        //             <li>
        //                 <p>Post Sticky Notes</p>
        //             </li>
        //             <li>
        //                 <p>Visit your Links</p>
        //             </li>
        //         </ul>
        //     </CustomGrid>
        // ),
    },
    {
        id: 2,
        value: TabsValues.Audience,
        label: TabsLabels.Audience,
        // tooltip: (
        //     <CustomGrid
        //         display="flex"
        //         flexDirection="column"
        //         bgcolor="black"
        //         color="white"
        //     >
        //         <p>Audience (1000 Max)</p>
        //         <ul>
        //             <li>
        //                 <p>Are Seen & Hear</p>
        //             </li>
        //             <li>
        //                 <p>Can Chat on Sidebar</p>
        //             </li>
        //             <li>
        //                 <p>Post Sticky Notes (members)</p>
        //             </li>
        //             <li>
        //                 <p>Visit your Links</p>
        //             </li>
        //         </ul>
        //     </CustomGrid>
        // ),
    },
];

const Component = ({ onUpdate }: { onUpdate: () => void }) => {
    const buttonSaveRef = useRef<HTMLButtonElement | null>(null);
    const formParticipantsRef = useRef<{ getValues: () => FormDataPayment }>(
        null,
    );
    const formAudienceRef = useRef<{ getValues: () => FormDataPayment }>(null);

    const paymentMeetingParticipant = useStore($paymentMeetingParticipant);
    const paymentPaywallParticipant = useStore($paymentPaywallParticipant);
    const paymentMeetingLurker = useStore($paymentMeetingLurker);
    const paymentPaywallLurker = useStore($paymentPaywallLurker);
    const isConnectedStripe = useStore($isConnectedStripe);

    const { activeItem, onValueChange } = useValueSwitcher<
        TabsValues,
        TabsLabels
    >({
        values: tabs,
        initialValue: tabs[0].value,
    });

    const onSubmit = useCallback(async () => {
        const paymentParticipant = formParticipantsRef.current?.getValues();
        const paymentAudience = formAudienceRef.current?.getValues();
        updatePaymentMeetingEvent({
            meeting: {
                participant: {
                    enabled: paymentParticipant?.enabledMeeting ?? false,
                    price: paymentParticipant?.templatePrice ?? 5,
                    currency:
                        paymentParticipant?.templateCurrency ??
                        DEFAULT_PAYMENT_CURRENCY,
                },
                lurker: {
                    enabled: paymentAudience?.enabledMeeting ?? false,
                    price: paymentAudience?.templatePrice ?? 5,
                    currency:
                        paymentAudience?.templateCurrency ??
                        DEFAULT_PAYMENT_CURRENCY,
                },
            },
            paywall: {
                participant: {
                    enabled: paymentParticipant?.enabledPaywall ?? false,
                    price: paymentParticipant?.paywallPrice ?? 5,
                    currency:
                        paymentParticipant?.paywallCurrency ??
                        DEFAULT_PAYMENT_CURRENCY,
                },
                lurker: {
                    enabled: paymentAudience?.enabledPaywall ?? false,
                    price: paymentAudience?.paywallPrice ?? 5,
                    currency:
                        paymentAudience?.paywallCurrency ??
                        DEFAULT_PAYMENT_CURRENCY,
                },
            },
        });
        onUpdate?.();
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
            <CustomGrid
                container
                columnGap={4}
                direction="row"
                alignItems="center"
                marginBottom={2}
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
                    ref={formParticipantsRef}
                />
                <MeetingMonezationForm
                    enableForm={activeItem.value === TabsValues.Audience}
                    paymentMeeting={paymentMeetingLurker}
                    paymentPaywall={paymentPaywallLurker}
                    onFocusInput={handleFocusInput}
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
