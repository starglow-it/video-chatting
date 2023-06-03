import React, { useRef, memo, useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useMediaQuery } from '@mui/material';

// custom
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomSlider } from '@library/custom/CustomSlider/CustomSlider';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// components
import { SkeletonTemplate } from '@components/Templates/SkeletonTemplate/SkeletonTemplate';

// icons
import { PrevSliderArrow } from 'shared-frontend/icons/OtherIcons/PrevSliderArrow';
import { NextSliderArrow } from 'shared-frontend/icons/OtherIcons/NextSliderArrow';

// helpers
import { unflatArray } from '../../../utils/arrays/unflatArray';

// types
import { TemplateGridProps } from './types';

// styles
import styles from './TemplatesGrid.module.scss';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { PlusIcon } from 'shared-frontend/icons/OtherIcons/PlusIcon';

const DotsComponent = (
    dotsRef: React.MutableRefObject<HTMLUListElement | null>,
) =>
    function render(dots: React.ReactNode) {
        return <ul ref={dotsRef}>{dots}</ul>;
    };

const PagingComponent = (activeSlider: number) =>
    function render(i: number) {
        return (
            <div
                className={clsx(styles.dotSlider, {
                    [styles.activeDot]: activeSlider === i,
                })}
            />
        );
    };

const Component = <TemplateType extends { id: string }>({
    TemplateComponent,
    list,
    count,
    onPageChange,
    onChooseTemplate,
    outerClassName,
    innerClassName,
    itemWidth = 334,
    itemGap = 3,
    allowCreate = false,
    onCreate,
}: TemplateGridProps<TemplateType>) => {
    const [activeSlider, setActiveSlider] = useState(0);
    const [skip, setSkip] = useState(0);

    const dotsRef = useRef<HTMLUListElement | null>(null);

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

        // const skeletonCount = count - initialTemplatesRender.length;

        // const allSkeletonTemplates = [
        //     ...new Array(skeletonCount).fill(0).keys(),
        // ].map(item => ({
        //     id: `${item}`,
        //     component: <SkeletonTemplate key={item} />,
        // }));

        // const commonComponentsArray = [
        //     ...initialTemplatesRender,
        //     ...allSkeletonTemplates,
        // ];

        // const unflattedArray = unflatArray<{
        //     id: string;
        //     component: JSX.Element;
        // }>(commonComponentsArray, 6);

        // if (unflattedArray) {
        //     return unflattedArray.map(slideComponents => {
        //         const elements = slideComponents.map(
        //             element => element.component,
        //         );
        //         const key = slideComponents
        //             .map(element => element.id)
        //             .reduce((acc, b) => `${acc}${b}`, '');

        //         return (
        //             <CustomBox
        //                 key={key}
        //                 display="grid"
        //                 gap={itemGap}
        //                 gridTemplateColumns={`repeat(${
        //                     is1100Media ? 'auto-fit' : '3'
        //                 }, minmax(${itemWidth}px, 1fr))`}
        //             >
        //                 {elements}
        //             </CustomBox>
        //         );
        //     });
        // }

        return [];
    }, [list, skip, count, is1100Media, onChooseTemplate, TemplateComponent]);




    return (
        <CustomGrid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            className={outerClassName || styles.templatesWrapper}
        >
            <CustomBox className={innerClassName || styles.templatesContent}>
                {/* {count > 6 ? (
                    <CustomSlider sliderSettings={sliderSettings}>
                        {renderTemplates}
                    </CustomSlider>
                ) : ( */}
                <CustomGrid container gap={3} justifyContent="center">
                    {renderTemplates}
                </CustomGrid>
                {/* )} */}
            </CustomBox>
        </CustomGrid>
    );
};

export const TemplatesGrid = memo(Component) as typeof Component;
