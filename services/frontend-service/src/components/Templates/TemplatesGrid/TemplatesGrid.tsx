import React, { useRef, memo, useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useMediaQuery } from '@mui/material';

// custom
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomSlider } from '@library/custom/CustomSlider/CustomSlider';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// components
import { SkeletonTemplate } from '@components/Templates/SkeletonTemplate/SkeletonTemplate';

// icons
import { PrevSliderArrow } from '@library/icons/PrevSliderArrow';
import { NextSliderArrow } from '@library/icons/NextSliderArrow';

// helpers
import { unflatArray } from '../../../utils/arrays/unflatArray';

// types
import { TemplateGridProps } from './types';

// styles
import styles from './TemplatesGrid.module.scss';

const DotsComponent = (dotsRef: React.MutableRefObject<HTMLUListElement | null>) =>
    function render(dots: React.ReactNode) {
        return <ul ref={dotsRef}>{dots}</ul>;
    };

const PagingComponent = (activeSlider: number) =>
    function render(i: number) {
        return (
            <div className={clsx(styles.dotSlider, { [styles.activeDot]: activeSlider === i })} />
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
}: TemplateGridProps<TemplateType>) => {
    const [activeSlider, setActiveSlider] = useState(0);
    const [skip, setSkip] = useState(0);

    const dotsRef = useRef<HTMLUListElement | null>(null);

    const is1100Media = useMediaQuery('(max-width:1100px)');

    const renderTemplates = useMemo(() => {
        const initialTemplatesRender = list.map(template => ({
            id: template.id,
            component: (
                <TemplateComponent
                    key={template.id}
                    template={template}
                    onChooseTemplate={onChooseTemplate}
                />
            ),
        }));

        if (count <= 6) {
            return initialTemplatesRender.map(element => element.component);
        }

        const skeletonCount = count - initialTemplatesRender.length;

        const allSkeletonTemplates = [...new Array(skeletonCount).fill(0).keys()].map(item => ({
            id: `${item}`,
            component: <SkeletonTemplate key={item} />,
        }));

        const commonComponentsArray = [...initialTemplatesRender, ...allSkeletonTemplates];

        const unflattedArray = unflatArray<{ id: string; component: JSX.Element }>(
            commonComponentsArray,
            6,
        );

        if (unflattedArray) {
            return unflattedArray.map(slideComponents => {
                const elements = slideComponents.map(element => element.component);
                const key = slideComponents
                    .map(element => element.id)
                    .reduce((acc, b) => `${acc}${b}`, '');

                return (
                    <CustomBox
                        key={key}
                        display="grid"
                        gap={itemGap}
                        gridTemplateColumns={`repeat(${
                            is1100Media ? 'auto-fit' : '3'
                        }, minmax(${itemWidth}px, 1fr))`}
                    >
                        {elements}
                    </CustomBox>
                );
            });
        }

        return [];
    }, [list, skip, count, is1100Media, onChooseTemplate, TemplateComponent]);

    const handleLoadTemplates = useCallback((data: number) => {
        setSkip(prev => {
            const newSkip = prev > data ? prev : data;

            if (prev !== newSkip) {
                onPageChange(newSkip + 1);
            }

            return newSkip;
        });
    }, []);

    const handleChangeActiveSlider = useCallback((oldIndex: number, newIndex: number) => {
        setActiveSlider(newIndex);
    }, []);

    const sliderSettings = useMemo(
        () => ({
            infinite: true,
            dotsClass: styles.slider,
            afterChange: handleLoadTemplates,
            beforeChange: handleChangeActiveSlider,
            appendDots: DotsComponent(dotsRef),
            customPaging: PagingComponent(activeSlider),
            nextArrow: <NextSliderArrow customClassName={styles.nextArrow} dotsRef={dotsRef} />,
            prevArrow: <PrevSliderArrow customClassName={styles.prevArrow} dotsRef={dotsRef} />,
        }),
        [handleLoadTemplates, activeSlider, handleChangeActiveSlider],
    );

    return (
        <CustomGrid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            className={outerClassName || styles.templatesWrapper}
        >
            <CustomBox className={innerClassName || styles.templatesContent}>
                {count > 6 ? (
                    <CustomSlider sliderSettings={sliderSettings}>{renderTemplates}</CustomSlider>
                ) : (
                    <CustomGrid container gap={3} justifyContent="center">
                        {renderTemplates}
                    </CustomGrid>
                )}
            </CustomBox>
        </CustomGrid>
    );
};

export const TemplatesGrid = memo(Component) as typeof Component;
