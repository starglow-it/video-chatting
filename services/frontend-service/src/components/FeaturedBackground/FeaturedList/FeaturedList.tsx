import { memo, useMemo, useRef } from 'react';
import { useMediaQuery } from '@mui/material';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomSlider } from '@library/custom/CustomSlider/CustomSlider';
import { SkeletonTemplate } from '@components/Templates/SkeletonTemplate/SkeletonTemplate';
import { unflatArray } from 'src/utils/arrays/unflatArray';
import { NextSliderArrow } from 'shared-frontend/icons/OtherIcons/NextSliderArrow';
import { PrevSliderArrow } from 'shared-frontend/icons/OtherIcons/PrevSliderArrow';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { FeaturedItem } from '../FeaturedItem/FeaturedItem';
import styles from './FeaturedList.module.scss';
import { IFeaturedBackground } from 'shared-types';

const Component = ({
    count = 3,
    list = [],
    itemWidth = 334,
    itemGap = 3,
}: {
    count: number;
    list: IFeaturedBackground[];
    itemWidth?: number;
    itemGap?: number;
}) => {
    const dotsRef = useRef<HTMLUListElement | null>(null);
    const is1100Media = useMediaQuery('(max-width:1100px)');

    const renderTemplates = useMemo(() => {
        console.log('#Duy Phan console', list);
        const initialTemplatesRender = list.map(item => ({
            id: item.id,
            component: <FeaturedItem key={item.id} item={item} />,
        }));

        if (count <= 3) {
            return initialTemplatesRender.map(element => element.component);
        }

        const skeletonCount = count - initialTemplatesRender.length;

        const allSkeletonTemplates = [
            ...new Array(skeletonCount).fill(0).keys(),
        ].map(item => ({
            id: `${item}`,
            component: <SkeletonTemplate key={item} />,
        }));

        const commonComponentsArray = [
            ...initialTemplatesRender,
            ...allSkeletonTemplates,
        ];

        const unflattedArray = unflatArray<{
            id: string;
            component: JSX.Element;
        }>(commonComponentsArray, 3);

        if (unflattedArray) {
            return unflattedArray.map(slideComponents => {
                const elements = slideComponents.map(
                    element => element.component,
                );
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
    }, [list.length]);

    const sliderSettings = useMemo(
        () => ({
            infinite: true,
            dotsClass: styles.slider,
            // afterChange: handleLoadTemplates,
            // beforeChange: handleChangeActiveSlider,
            // appendDots: DotsComponent(dotsRef),
            dots: false,
            nextArrow: (
                <NextSliderArrow
                    customClassName={styles.nextArrow}
                    dotsRef={dotsRef}
                />
            ),
            prevArrow: (
                <PrevSliderArrow
                    customClassName={styles.prevArrow}
                    dotsRef={dotsRef}
                />
            ),
        }),
        [],
    );

    return (
        <CustomGrid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            className={styles.featuredWrapper}
        >
            <CustomBox className={styles.featuredContent}>
                {count > 3 ? (
                    <CustomSlider sliderSettings={sliderSettings}>
                        {renderTemplates}
                    </CustomSlider>
                ) : (
                    <CustomGrid container gap={3} justifyContent="center">
                        {renderTemplates}
                    </CustomGrid>
                )}
            </CustomBox>
        </CustomGrid>
    );
};

export const FeaturedList = memo(Component);
