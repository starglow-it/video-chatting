import { AccordionDetailsProps, AccordionSummaryProps } from '@mui/material';

export type CustomAccordionProps = {
    sumary?: JSX.Element;
    detail?: JSX.Element;
    sumaryProps?: AccordionSummaryProps;
    detailProps?: AccordionDetailsProps;
};
