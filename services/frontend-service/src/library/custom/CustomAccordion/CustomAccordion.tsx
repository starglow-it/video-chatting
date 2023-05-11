import { memo } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionProps,
    AccordionSummary,
} from '@mui/material';
import { CustomAccordionProps } from './types';

const Component = ({
    sumary,
    sumaryProps = {},
    detail,
    detailProps,
}: CustomAccordionProps & AccordionProps) => {
    return (
        <Accordion>
            <AccordionSummary {...sumaryProps}>{sumary}</AccordionSummary>
            <AccordionDetails {...detailProps}>{detail}</AccordionDetails>
        </Accordion>
    );
};

export const CustomAccordion = memo(Component);