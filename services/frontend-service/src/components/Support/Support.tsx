import React, { memo, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

// hooks
import { useNavigation } from '@hooks/useNavigation';

// custom
import { CustomGrid } from 'shared-frontend/library';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomChip } from 'shared-frontend/library';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// icons
import { ArrowLeftIcon } from 'shared-frontend/icons';

// components
import { FAQ } from '@components/Support/Faq/Faq';
import { ContactUsForm } from '@components/Support/ContactUsForm/ContactUsForm';

// shared
import { CustomImage } from 'shared-frontend/library';

// styles
import { Translation } from '@library/common/Translation/Translation';
import styles from './Support.module.scss';

enum Tabs {
    Faq = 'faq',
    Contacts = 'contacts',
}

const tabs = [
    {
        value: Tabs.Faq,
        translationKey: 'faq',
    },
    {
        value: Tabs.Contacts,
        translationKey: 'contacts',
    },
];

const Component = () => {
    const { activeTab, onChange: onChangeTab } = useNavigation({ tabs });

    const router = useRouter();

    const handleGoBack = useCallback(() => {
        router.back();
    }, [router.back]);

    const chips = useMemo(
        () =>
            tabs.map(({ value, translationKey }) => (
                <CustomChip
                    active={value === activeTab.value}
                    label={
                        <CustomTypography>
                            <Translation
                                nameSpace="static"
                                translation={`${translationKey}.title`}
                            />
                        </CustomTypography>
                    }
                    className={styles.chip}
                    onClick={() => onChangeTab(value)}
                />
            )),
        [activeTab, onChangeTab],
    );

    return (
        <CustomGrid className={styles.wrapper} container justifyContent="center">
            <CustomGrid container alignItems="center" justifyContent="center" gap={1.5}>
                <CustomImage src="/images/handshake.png" width="40px" height="40px" />
                <CustomTypography variant="h1" nameSpace="static" translation="support.title" />
            </CustomGrid>
            <CustomGrid container justifyContent="space-between" className={styles.chipsContainer}>
                <CustomGrid
                    container
                    justifyContent="center"
                    alignItems="center"
                    onClick={handleGoBack}
                    className={styles.backButton}
                >
                    <ArrowLeftIcon width="32px" height="32px" />
                </CustomGrid>
                <CustomGrid item container gap={1.5} width="fit-content" justifyContent="center">
                    {chips}
                </CustomGrid>
                <CustomGrid item className={styles.emptyItem} />
            </CustomGrid>
            <CustomGrid container className={styles.content}>
                <ConditionalRender condition={activeTab.value === Tabs.Faq}>
                    <FAQ />
                </ConditionalRender>
                <ConditionalRender condition={activeTab.value === Tabs.Contacts}>
                    <ContactUsForm />
                </ConditionalRender>
            </CustomGrid>
        </CustomGrid>
    );
};

export const Support = memo(Component);
