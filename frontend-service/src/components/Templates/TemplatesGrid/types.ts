import React from 'react';
import { Template, UserTemplate } from '../../../store/types';

export type TemplateGridProps<TemplateType> = {
    TemplateComponent: React.MemoExoticComponent<
        (props: { template: TemplateType }) => JSX.Element
    >;
    list: TemplateType[];
    count: number;
    onPageChange: (page: number) => void;
};
