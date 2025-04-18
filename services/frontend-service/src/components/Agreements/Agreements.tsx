import { memo, useCallback, useEffect, useMemo } from 'react';
import Router, { useRouter } from 'next/router';

// hooks
import { useLocalization } from '@hooks/useTranslation';
import { useNavigation } from '@hooks/useNavigation';

// shared
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomChip } from 'shared-frontend/library/custom/CustomChip';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { Translation } from '@library/common/Translation/Translation';

// icons
import { ArrowLeftIcon } from 'shared-frontend/icons/OtherIcons/ArrowLeftIcon';

// styles
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import styles from './Agreements.module.scss';

enum Tabs {
    TermsOfService = 'termsOfService',
    PrivacyPolicy = 'privacyPolicy',
}

const tabs = [
    {
        value: Tabs.TermsOfService,
        translationKey: 'terms',
        view: `<iframe src="/terms.html" width="700" height="5000" style="border: none;display: inline-block"></iframe>`,
    },
    {
        value: Tabs.PrivacyPolicy,
        translationKey: 'privacy',
        view: `<iframe src="/privacy.html" width="700" height="5100" style="border: none;display: inline-block"></iframe>`,
    },
];

const Component = () => {
    const { translation } = useLocalization('static');

    const { activeTab, onChange: onChangeTab } = useNavigation({
        tabs,
    });

    const router = useRouter();

    const handleGoBack = useCallback(() => {
        Router.back();
    }, [router]);

    useEffect(() => {
        if (router.query.section === 'privacy') {
            onChangeTab(Tabs.PrivacyPolicy);
        }
    }, [router.query]);

    const chips = useMemo(
        () =>
            tabs.map(({ value, translationKey }) => (
                <CustomChip
                    key={translationKey}
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
        [activeTab, translation, onChangeTab],
    );

    return (
        <CustomGrid
            className={styles.agreementsWrapper}
            container
            justifyContent="center"
        >
            <CustomGrid
                container
                alignItems="center"
                justifyContent="center"
                gap={1.5}
            >
                <CustomImage
                    src="/images/agreements.webp"
                    width="40px"
                    height="40px"
                    alt="agreements"
                />
                <CustomTypography
                    variant="h1"
                    nameSpace="static"
                    translation="agreements.title"
                />
            </CustomGrid>
            <CustomGrid
                container
                justifyContent="space-between"
                className={styles.chipsContainer}
            >
                <CustomGrid
                    container
                    justifyContent="center"
                    alignItems="center"
                    onClick={handleGoBack}
                    className={styles.backButton}
                >
                    <ArrowLeftIcon width="32px" height="32px" />
                </CustomGrid>
                <CustomGrid
                    item
                    container
                    gap={1.5}
                    width="fit-content"
                    justifyContent="center"
                >
                    {chips}
                </CustomGrid>
                <CustomGrid item className={styles.emptyItem} />
            </CustomGrid>
            <CustomPaper className={styles.content}>
                <CustomGrid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <CustomTypography
                        variant="h2bold"
                        nameSpace="static"
                        translation={`${activeTab.translationKey}.title`}
                    />
                    <CustomTypography
                        variant="body2bold"
                        className={styles.termsText}
                        dangerouslySetInnerHTML={{
                            __html: activeTab.view,
                        }}
                    />
                </CustomGrid>
            </CustomPaper>
        </CustomGrid>
    );
};

export const Agreements = memo(Component);
