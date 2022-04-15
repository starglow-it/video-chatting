import React from 'react';

import { Template, UserTemplate } from '../../../store/types';

export type TemplateGridProps = {
    TemplateComponent: React.MemoExoticComponent<
        (props: { template: UserTemplate | Template }) => JSX.Element
    >;
    list: (UserTemplate | Template)[];
    count: number;
    onPageChange: (page: number) => void;
};
