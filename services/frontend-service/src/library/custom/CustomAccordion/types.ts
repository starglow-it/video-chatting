import { AccordionDetailsProps, AccordionSummaryProps } from "@mui/material";

export type CustomAccordionProps = {
    sumary?: React.ReactNode;
    detail?: React.ReactNode;
    sumaryProps?: AccordionSummaryProps;
    detailProps?: AccordionDetailsProps;
};
