import React from 'react';
import { Template } from '../../../store/types';

export type TemplateGridProps = {
    TemplateComponent: React.MemoExoticComponent<(props: { template: Template }) => JSX.Element>;
    list: Template[];
    count: number;
    onPageChange: (page: number) => void;
};
