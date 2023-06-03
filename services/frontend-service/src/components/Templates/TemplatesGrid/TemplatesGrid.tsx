import React, { memo, useMemo } from 'react';
import { useMediaQuery } from '@mui/material';

// custom
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// types
import { TemplateGridProps } from './types';

// styles
import styles from './TemplatesGrid.module.scss';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { PlusIcon } from 'shared-frontend/icons/OtherIcons/PlusIcon';

const Component = <TemplateType extends { id: string }>({
    TemplateComponent,
    list,
    count,
    onChooseTemplate,
    outerClassName,
    innerClassName,
    allowCreate = false,
    onCreate,
}: TemplateGridProps<TemplateType>) => {
    const is1100Media = useMediaQuery('(max-width:1100px)');

    const renderTemplates = useMemo(() => {
        const initialTemplatesRender = list?.map(template => ({
            id: template.id,
            component: (
                <TemplateComponent
                    key={template.id}
                    template={template}
                    onChooseTemplate={onChooseTemplate}
                />
            ),
        }));

        if (allowCreate) {
            initialTemplatesRender.unshift({
                id: 'create',
                component: (
                    <CustomGrid
                        className={styles.addItem}
                        container
                        justifyContent="center"
                        alignItems="center"
                        onClick={onCreate}
                    >
                        <PlusIcon width="22px" height="22px" />
                        <CustomTypography>Create room</CustomTypography>
                    </CustomGrid>
                ),
            });
        }

        return initialTemplatesRender.map(element => element.component);
    }, [list, count, is1100Media, onChooseTemplate, TemplateComponent]);

    return (
        <CustomGrid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            className={outerClassName || styles.templatesWrapper}
        >
            <CustomBox className={innerClassName || styles.templatesContent}>
                <CustomGrid container gap={3} justifyContent="center">
                    {renderTemplates}
                </CustomGrid>
            </CustomBox>
        </CustomGrid>
    );
};

export const TemplatesGrid = memo(Component) as typeof Component;
