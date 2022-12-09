import React, { memo, useCallback, useState } from 'react';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomAccordion } from 'shared-frontend/library/custom/CustomAccordion';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { Translation } from '@library/common/Translation/Translation';

// icons
import { ArrowIcon } from 'shared-frontend/icons/OtherIcons/ArrowIcon';

// styles
import styles from './Faq.module.scss';

enum Accordion {
    IsItFree = 'isItFree',
    WillThereBeMoreScenes = 'willThereBeMoreScenes',
    FuturePlans = 'futurePlans',
    CanICreateScene = 'canICreateScene',
}

const Component = () => {
    const [currentAccordionId, setCurrentAccordionId] = useState('');

    const handleChangeAccordion = useCallback((accordionId: string) => {
        setCurrentAccordionId(prev => (prev === accordionId ? '' : accordionId));
    }, []);

    return (
        <CustomGrid container gap={2} direction="column">
            <CustomAccordion
                currentAccordionId={currentAccordionId}
                accordionId={Accordion.IsItFree}
                onChange={handleChangeAccordion}
                label={<Translation nameSpace="static" translation="faq.isItFree.title" />}
                typographyVariant="h2"
                variant="large"
                AccordionSummaryIcon={
                    <ArrowIcon width="32px" height="32px" className={styles.arrowIcon} />
                }
            >
                <CustomTypography nameSpace="static" translation="faq.isItFree.description" />
            </CustomAccordion>
            <CustomAccordion
                currentAccordionId={currentAccordionId}
                accordionId={Accordion.WillThereBeMoreScenes}
                onChange={handleChangeAccordion}
                label={
                    <Translation nameSpace="static" translation="faq.willThereBeMoreScenes.title" />
                }
                typographyVariant="h2"
                variant="large"
                AccordionSummaryIcon={
                    <ArrowIcon width="32px" height="32px" className={styles.arrowIcon} />
                }
            >
                <CustomTypography
                    nameSpace="static"
                    translation="faq.willThereBeMoreScenes.description"
                />
            </CustomAccordion>
            <CustomAccordion
                currentAccordionId={currentAccordionId}
                accordionId={Accordion.FuturePlans}
                onChange={handleChangeAccordion}
                label={<Translation nameSpace="static" translation="faq.futurePlans.title" />}
                typographyVariant="h2"
                variant="large"
                AccordionSummaryIcon={
                    <ArrowIcon width="32px" height="32px" className={styles.arrowIcon} />
                }
            >
                <CustomTypography nameSpace="static" translation="faq.futurePlans.description" />
            </CustomAccordion>
            <CustomAccordion
                currentAccordionId={currentAccordionId}
                accordionId={Accordion.CanICreateScene}
                onChange={handleChangeAccordion}
                label={<Translation nameSpace="static" translation="faq.canICreateScene.title" />}
                typographyVariant="h2"
                variant="large"
                AccordionSummaryIcon={
                    <ArrowIcon width="32px" height="32px" className={styles.arrowIcon} />
                }
            >
                <CustomTypography
                    nameSpace="static"
                    translation="faq.canICreateScene.description"
                />
            </CustomAccordion>
        </CustomGrid>
    );
};

export const FAQ = memo(Component);
