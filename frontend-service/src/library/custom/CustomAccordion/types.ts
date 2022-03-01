import React from 'react';
import { TranslationProps } from '@library/common/Translation/types';

type BaseCustomAccordionProps = {
    currentAccordionId: string;
    accordionId: string;
    AccordionIcon: JSX.Element;
    onChange: (accordionId: string) => void;
};

export type CustomAccordionProps = React.PropsWithChildren<BaseCustomAccordionProps> &
    TranslationProps;
