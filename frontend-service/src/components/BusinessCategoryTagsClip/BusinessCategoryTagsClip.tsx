import React, { memo, useLayoutEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

// hooks

// components
import { BusinessCategoryItem } from '@components/BusinessCategoryItem/BusinessCategoryItem';
import { TagWrapper } from '@library/common/TagWrapper/TagWrapper';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomPopper } from '@library/custom/CustomPopper/CustomPopper';
import { useToggle } from '../../hooks/useToggle';

// styles
import styles from './BusinessCategoryTagsClip.module.scss';

// types
import { BusinessCategory } from '../../store/types';

const BusinessCategoryTagsClip = memo(
    ({ lines, tags, maxWidth }: { lines: number; tags?: BusinessCategory[]; maxWidth: number }) => {
        const [isNeedToRenderSeeAllTags, setIsNeedToRenderSeeAllTags] = useState<boolean>(false);

        const businessTagsRef = useRef<HTMLDivElement>(null);
        const hiddenBusinessTagsRef = useRef<HTMLDivElement>(null);

        const { value: openMoreTags, onToggleSwitch: handleToggleMoreTags } = useToggle(false);

        useLayoutEffect(() => {
            setTimeout(() => {
                setIsNeedToRenderSeeAllTags(true);
            }, 100);
        }, []);

        const hideData = useMemo(() => {
            const initialArray = [...(hiddenBusinessTagsRef?.current?.children || [])];

            const [firstTag, ...restTags] = tags || [];

            const searchArray = tags?.length < 3 ? restTags : tags;

            const initialReduceArray = new Array(lines + 1)
                .fill({ elements: [], overallWidth: 0 })
                .map((line, index) =>
                    index === lines - 1 && firstTag && tags?.length < 3
                        ? { ...line, elements: [firstTag] }
                        : line,
                );

            return initialArray?.reduce((acc, element, index) => {
                const targetCategory = searchArray?.find(
                    (_, categoryIndex) => categoryIndex === index,
                );

                if (!targetCategory) return acc;

                const rect = element.getBoundingClientRect();

                const findLineIndex = acc.findIndex(
                    line => line.overallWidth + rect.width < maxWidth,
                );

                return acc.map((line, indexLine) => {
                    if (indexLine === findLineIndex) {
                        return {
                            id: line.id,
                            overallWidth: line.overallWidth + rect.width,
                            elements: [...line.elements, targetCategory],
                        };
                    }
                    if (findLineIndex === -1 && indexLine === lines) {
                        return {
                            id: line.id,
                            overallWidth: line.overallWidth + rect.width,
                            elements: [...line.elements, targetCategory],
                        };
                    }
                    if (indexLine !== findLineIndex) {
                        return line;
                    }
                });
            }, initialReduceArray);
        }, [isNeedToRenderSeeAllTags, tags]);

        const renderInitialTags = useMemo(
            () =>
                tags?.map((category: BusinessCategory) => (
                    <BusinessCategoryItem
                        typographyVariant="body2"
                        key={category.key}
                        category={category}
                    />
                )),
            [tags],
        );

        const renderTagsWithOutHidden = useMemo(
            () =>
                hideData.slice(0, lines).map((elementsData, index) => (
                    <CustomGrid container gap={1.25}>
                        {elementsData.elements.map((category: BusinessCategory) => (
                            <BusinessCategoryItem
                                className={clsx({ [styles.businessTag]: index === 0 })}
                                key={category.key}
                                category={category}
                                typographyVariant="body2"
                            />
                        ))}
                        {index === lines - 1 && Boolean(hideData[lines]?.elements?.length) && (
                            <TagWrapper
                                ref={businessTagsRef}
                                className={styles.showMoreTags}
                                onMouseEnter={handleToggleMoreTags}
                                onMouseLeave={handleToggleMoreTags}
                            >
                                <CustomTypography
                                    variant="body2"
                                    className={styles.numberOfHiddenTags}
                                >
                                    + {hideData[lines]?.elements?.length}
                                </CustomTypography>
                            </TagWrapper>
                        )}
                    </CustomGrid>
                )),
            [hideData],
        );

        const renderHiddenTags = useMemo(() => {
            const hiddenArray = hideData.slice(lines, lines + 1);

            return hiddenArray.map(elementsData => (
                <CustomGrid container gap={1.25} className={styles.moreTags}>
                    {elementsData?.elements?.map((category: BusinessCategory) => (
                        <BusinessCategoryItem
                            typographyVariant="body2"
                            key={category.key}
                            category={category}
                        />
                    ))}
                </CustomGrid>
            ));
        }, [hideData]);

        return (
            <CustomBox className={styles.tagsWrapper}>
                <CustomGrid
                    container
                    ref={hiddenBusinessTagsRef}
                    gap={1.25}
                    className={clsx(styles.businessCategoryTags, styles.hiddenInitialTags)}
                >
                    {renderInitialTags}
                </CustomGrid>
                <CustomGrid container gap={1.25} className={styles.businessCategoryTags}>
                    {renderTagsWithOutHidden}
                </CustomGrid>
                <CustomPopper
                    id="hiddenBusinessTags"
                    open={openMoreTags}
                    anchorEl={businessTagsRef.current}
                >
                    <CustomPaper className={styles.hiddenTags}>
                        <CustomGrid container gap={1.25}>
                            {renderHiddenTags}
                        </CustomGrid>
                    </CustomPaper>
                </CustomPopper>
            </CustomBox>
        );
    },
);

export { BusinessCategoryTagsClip };
