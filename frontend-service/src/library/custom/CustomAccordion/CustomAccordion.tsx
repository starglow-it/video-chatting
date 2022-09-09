import React, { memo, useCallback } from 'react';
import clsx from 'clsx';

import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

// custom
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// icons
import { RoundArrowIcon } from '@library/icons/RoundIcons/RoundArrowIcon';
import { CustomAccordionProps } from './types';

import styles from './CustomAccordion.module.scss';

const CustomAccordion = memo(
    ({
        AccordionIcon,
        AccordionSummaryIcon,
        currentAccordionId,
        accordionId,
        nameSpace,
        translation,
        typographyVariant,
        variant = 'base',
        onChange,
        children,
    }: CustomAccordionProps) => {
        const handleChangeAccordion = useCallback(() => {
            onChange(accordionId);
        }, []);

        return (
            <Accordion
                className={clsx({
                    [styles.base]: variant === 'base',
                    [styles.huge]: variant === 'large',
                })}
                classes={{
                    root: styles.accordion,
                }}
                square
                disableGutters
                expanded={currentAccordionId === accordionId}
                onChange={handleChangeAccordion}
            >
                <AccordionSummary
                    expandIcon={
                        AccordionSummaryIcon ?? <RoundArrowIcon width="24px" height="24px" />
                    }
                    className={styles.summary}
                    classes={{
                        content: styles.content,
                    }}
                >
                    <CustomGrid container gap={1}>
                        {AccordionIcon}
                        <CustomTypography
                            nameSpace={nameSpace}
                            translation={translation}
                            variant={typographyVariant}
                        />
                    </CustomGrid>
                </AccordionSummary>
                <AccordionDetails className={styles.details}>{children}</AccordionDetails>
            </Accordion>
        );
    },
);

export { CustomAccordion };
