import { memo } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionProps,
    AccordionSummary,
} from '@mui/material';
import { CustomAccordionProps } from './types';
import { RoundArrowIcon } from 'shared-frontend/icons/RoundIcons/RoundArrowIcon';
import styles from './CustomAccordion.module.scss';

const Component = ({
    sumary,
    sumaryProps = {},
    detail,
    detailProps,
}: CustomAccordionProps & AccordionProps) => {
    return (
        <Accordion className={styles.wrapper} >
            <AccordionSummary
                expandIcon={<RoundArrowIcon width="24px" height="24px" />}
                {...sumaryProps}
            >
                {sumary}
            </AccordionSummary>
            <AccordionDetails {...detailProps}>{detail}</AccordionDetails>
        </Accordion>
    );
};

export const CustomAccordion = memo(Component);
