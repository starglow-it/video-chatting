import { memo, useRef } from 'react';
import { useStore } from 'effector-react';

// icons
import { MonetizationIcon } from 'shared-frontend/icons/OtherIcons/MonetizationIcon';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// common
// validation
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

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
} from '../../../store/roomStores';
import styles from './MeetingMonetization.module.scss';
import { MeetingMonezationForm } from './MeetingMonezationForm';
import { FormDataPayment, TabsValues } from './type';

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

const Component = (
    {
        formParticipantsRef,
        formAudienceRef,
        onUpdate = () => { },
        onSave = () => { }
    }: {
        formParticipantsRef: { getValues: () => FormDataPayment },
        formAudienceRef: { getValues: () => FormDataPayment },
        onUpdate: () => void,
        onSave: () => void
    }
) => {
    const buttonSaveRef = useRef<HTMLButtonElement | null>(null);
    const paymentMeetingParticipant = useStore($paymentMeetingParticipant);
    const paymentPaywallParticipant = useStore($paymentPaywallParticipant);
    const paymentMeetingAudience = useStore($paymentMeetingAudience);
    const paymentPaywallAudience = useStore($paymentPaywallAudience);

    const { activeItem, onValueChange } = useValueSwitcher<
        TabsValues,
        TabsLabels
    >({
        values: tabs,
        initialValue: tabs[0].value,
    });

    const handleFocusInput = () => {
        buttonSaveRef.current?.classList.add(styles.animate);
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
                maxWidth={isMobile() ? undefined : '340px'}
                minWidth={isMobile() ? undefined : '340px'}
            >
                <CustomGrid
                    display="flex"
                    alignItems="center"
                    color="colors.black.primary"
                    flex={1}
                >
                    <MonetizationIcon width="24px" height="24px" />
                    <CustomTypography
                        nameSpace="meeting"
                        translation="features.monetization"
                        sx={{ fontSize: isMobile ? '10px' : '16px' }}
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
                    onSave={onSave}
                />
                <MeetingMonezationForm
                    enableForm={activeItem.value === TabsValues.Audience}
                    paymentMeeting={paymentMeetingAudience}
                    paymentPaywall={paymentPaywallAudience}
                    onFocusInput={handleFocusInput}
                    activeValue={activeItem.value}
                    ref={formAudienceRef}
                    onSave={onSave}
                />
            </CustomGrid>
        </>
    );
};

export const MeetingMonetizationPanel = memo(Component);
