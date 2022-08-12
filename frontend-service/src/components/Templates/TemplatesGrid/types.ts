import React from 'react';

import { Template, UserTemplate } from '../../../store/types';

export type TemplateGridProps = {
    TemplateComponent:
        | React.MemoExoticComponent<
              (props: {
                  template: UserTemplate;
                  onChooseTemplate: (templateId: UserTemplate['id']) => Promise<void>;
              }) => JSX.Element
          >
        | React.MemoExoticComponent<
              (props: {
                  template: Template;
                  onChooseTemplate: (templateId: Template['id']) => Promise<void>;
              }) => JSX.Element
          >;
    list: (UserTemplate | Template)[];
    count: number;
    onPageChange: (page: number) => void;
    onChooseTemplate:
        | ((templateId: Template['id']) => Promise<void>)
        | ((templateId: UserTemplate['id']) => Promise<void>);
    outerClassName?: string;
    innerClassName?: string;
    itemWidth?: number;
    itemGap?: number;
};
