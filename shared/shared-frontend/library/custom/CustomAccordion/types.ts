import React from 'react';
import { TranslationProps } from '@library/common/Translation/types';
import { TypographyProps, TypographyVariant } from '@mui/material';

type CustomAccordionVariants = 'base' | 'large';

type BaseCustomAccordionProps = {
    currentAccordionId: string;
    accordionId: string;
    AccordionIcon?: JSX.Element;
    AccordionSummaryIcon?: JSX.Element;
    onChange: (accordionId: string) => void;
    typographyVariant?: TypographyVariant;
    variant?: CustomAccordionVariants;
    label: string | JSX.Element;
    className?: string;
    typographyProps?: TypographyProps;
};

export type CustomAccordionProps = React.PropsWithChildren<BaseCustomAccordionProps> &
    TranslationProps;
