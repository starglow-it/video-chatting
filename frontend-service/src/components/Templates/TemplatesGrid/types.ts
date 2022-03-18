import React from 'react';
import { Template, UserTemplate } from '../../../store/types';

export type TemplateGridProps = {
    TemplateComponent: React.MemoExoticComponent<
        (props: { template: Template | UserTemplate }) => JSX.Element
    >;
    list: (Template | UserTemplate)[];
    count: number;
    onPageChange: (page: number) => void;
};
