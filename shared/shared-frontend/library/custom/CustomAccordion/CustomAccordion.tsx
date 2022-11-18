import React, { memo, useCallback } from 'react';
import clsx from 'clsx';

import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

// custom
import {CustomGrid, CustomTypography} from "../../custom";

// icons
import { RoundArrowIcon } from '../../../icons';
import { CustomAccordionProps } from './types';

import styles from './CustomAccordion.module.scss';

const Component = ({
   AccordionIcon,
   AccordionSummaryIcon,
   currentAccordionId,
   accordionId,
   typographyVariant,
   variant = 'base',
   onChange,
   label,
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
                        variant={typographyVariant}
                    >
                        {label}
                    </CustomTypography>
                </CustomGrid>
            </AccordionSummary>
            <AccordionDetails className={styles.details}>{children}</AccordionDetails>
        </Accordion>
    );
};

const CustomAccordion = memo(Component);

export default CustomAccordion;
