import React from 'react';

export type TemplateGridProps<TemplateType extends { id: string }> = {
    TemplateComponent: React.MemoExoticComponent<
        (props: {
            template: TemplateType;
            onChooseTemplate?: (
                templateId: TemplateType['id'],
            ) => void | Promise<void>;
        }) => JSX.Element
    >;
    list: TemplateType[];
    count: number;
    onPageChange: (page: number) => void;
    onChooseTemplate?: (templateId: TemplateType['id']) => Promise<void> | void;
    outerClassName?: string;
    innerClassName?: string;
    itemWidth?: number;
    itemGap?: number;
};
