import { memo } from 'react';

// custom
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// types
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { PlusIcon } from 'shared-frontend/icons/OtherIcons/PlusIcon';
import { TemplateGridProps } from './types';

// styles
import styles from './TemplatesGrid.module.scss';

const Component = <TemplateType extends { id: string }>({
    TemplateComponent,
    list,
    onChooseTemplate,
    outerClassName,
    innerClassName,
    allowCreate = false,
    onCreate,
    isCustomElementCreate = false,
    ElementCreate = (
        <CustomGrid display="flex" flexDirection="row" alignItems="center">
            <PlusIcon width="22px" height="22px" />
            <CustomTypography nameSpace="templates" translation="createRoom" />
        </CustomGrid>
    ),
}: TemplateGridProps<TemplateType>) => {
    const renderTemplates = () => {
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
                        flexDirection="column"
                        onClick={onCreate}
                        key="create-a-template"
                        gap={1}
                    >
                        {ElementCreate}
                        {!isCustomElementCreate && (
                            <>
                                <CustomTypography
                                    nameSpace="templates"
                                    translation="descCreateRoom"
                                    textAlign="center"
                                    fontSize={12}
                                />
                                <CustomTypography
                                    nameSpace="templates"
                                    translation="embedLinks"
                                    textAlign="center"
                                />
                            </>
                        )}
                    </CustomGrid>
                ),
            });
        }

        return initialTemplatesRender.map(element => element.component);
    };

    return (
        <CustomGrid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            className={outerClassName || styles.templatesWrapper}
        >
            <CustomBox className={innerClassName || styles.templatesContent}>
                <CustomGrid container gap={3} justifyContent="flex-start">
                    {renderTemplates()}
                </CustomGrid>
            </CustomBox>
        </CustomGrid>
    );
};

export const TemplatesGrid = memo(Component) as typeof Component;
