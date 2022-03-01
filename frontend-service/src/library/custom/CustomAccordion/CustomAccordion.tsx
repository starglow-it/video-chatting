import React, { memo, useCallback } from 'react';

import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

import { CustomAccordionProps } from './types';

import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { ArrowIcon } from '@library/icons/ArrowIcon';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

import styles from './CustomAccordion.module.scss';

const CustomAccordion = memo(
    ({
        AccordionIcon,
        currentAccordionId,
        accordionId,
        nameSpace,
        translation,
        onChange,
        children,
    }: CustomAccordionProps) => {
        const handleChangeAccordion = useCallback(() => {
            onChange(accordionId);
        }, []);

        return (
            <Accordion
                classes={{
                    root: styles.accordion,
                }}
                square
                disableGutters
                expanded={currentAccordionId === accordionId}
                onChange={handleChangeAccordion}
            >
                <AccordionSummary expandIcon={<ArrowIcon width="24px" height="24px" />}>
                    <CustomGrid container gap={1}>
                        {AccordionIcon}
                        <CustomTypography nameSpace={nameSpace} translation={translation} />
                    </CustomGrid>
                </AccordionSummary>
                <AccordionDetails>{children}</AccordionDetails>
            </Accordion>
        );
    },
);

export { CustomAccordion };
