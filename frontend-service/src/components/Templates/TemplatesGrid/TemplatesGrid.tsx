import React, { memo, useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';

// custom
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomSlider } from '@library/custom/CustomSlider/CustomSlider';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// components
import { SkeletonTemplate } from '@components/Templates/SkeletonTemplate/SkeletonTemplate';
import { SearchTemplates } from '@components/Templates/SearchTemplates/SearchTemplates';

// icons
import { PrevSliderArrow } from '@library/icons/PrevSliderArrow';
import { NextSliderArrow } from '@library/icons/NextSliderArrow';

// helpers
import { unflatArray } from '../../../utils/functions/unflatArray';

// types
import { TemplateGridProps } from './types';

// styles
import styles from './TemplatesGrid.module.scss';

function InitialComponent<TemplateType>({
    TemplateComponent,
    list,
    count,
    onPageChange,
}: TemplateGridProps<TemplateType>) {
    const [activeSlider, setActiveSlider] = useState(0);
    const [skip, setSkip] = useState(0);

    const renderTemplates = useMemo(() => {
        const initialTemplatesRender = list.map(template => ({
            id: template.templateId,
            component: <TemplateComponent key={template.templateId} template={template} />,
        }));

        if (count <= 6) {
            return initialTemplatesRender.map(element => element.component);
        }

        const skeletonCount = count - initialTemplatesRender.length;

        const allSkeletonTemplates = [...new Array(skeletonCount).fill(0).keys()].map(item => ({
            id: item,
            component: <SkeletonTemplate key={item} />,
        }));

        const commonComponentsArray = [...initialTemplatesRender, ...allSkeletonTemplates];

        const unflattedArray = unflatArray<{ id: number; component: JSX.Element }>(
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
                        gap={3}
                        gridTemplateColumns="repeat(auto-fit, minmax(334px, 1fr))"
                    >
                        {elements}
                    </CustomBox>
                );
            });
        }

        return [];
    }, [list, skip, count]);

    const handleLoadTemplates = useCallback(data => {
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
            appendDots: (dots: any) => <ul>{dots}</ul>,
            customPaging: (i: number) => (
                <div
                    className={clsx(styles.dotSlider, {
                        [styles.activeDot]: activeSlider === i,
                    })}
                />
            ),
            nextArrow: <NextSliderArrow customClassName={styles.nextArrow} />,
            prevArrow: <PrevSliderArrow customClassName={styles.prevArrow} />,
        }),
        [handleLoadTemplates, activeSlider],
    );

    return (
        <CustomGrid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            className={styles.templatesWrapper}
        >
            <SearchTemplates />
            <CustomBox className={styles.templatesContent}>
                {count > 6 ? (
                    <CustomSlider sliderSettings={sliderSettings}>{renderTemplates}</CustomSlider>
                ) : (
                    <CustomGrid container gap={2} justifyContent="center">
                        {renderTemplates}
                    </CustomGrid>
                )}
            </CustomBox>
        </CustomGrid>
    );
}

const TemplatesGrid = memo(InitialComponent);

export { TemplatesGrid };
