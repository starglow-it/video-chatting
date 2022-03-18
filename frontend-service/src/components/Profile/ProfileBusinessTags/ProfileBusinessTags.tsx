import React, { memo, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';

// hooks

// stores

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomPopper } from '@library/custom/CustomPopper/CustomPopper';

// components
import { BusinessCategoryItem } from '@components/BusinessCategoryItem/BusinessCategoryItem';
import { TagWrapper } from '@library/common/TagWrapper/TagWrapper';
import { $profileStore } from '../../../store/profile';
import { useToggle } from '../../../hooks/useToggle';

// types
import { BusinessCategory } from '../../../store/types';

// styles
import styles from './ProfileBusinessTags.module.scss';

type TagLineType = {
    elements: BusinessCategory[];
    overallWidth: number;
    id: number;
};

const ProfileBusinessTags = memo(() => {
    const profileState = useStore($profileStore);

    const [isNeedToRenderSeeAllTags, setIsNeedToRenderSeeAllTags] = useState<boolean>(false);

    const businessTagsRef = useRef<HTMLDivElement>();
    const hiddenBusinessTagsRef = useRef<HTMLDivElement>();

    const { value: openMoreTags, onToggleSwitch: handleToggleMoreTags } = useToggle(false);

    useLayoutEffect(() => {
        setTimeout(() => {
            setIsNeedToRenderSeeAllTags(true);
        }, 100);
    }, []);

    const hideData = useMemo(() => {
        const initialArray = [...(hiddenBusinessTagsRef?.current?.children || [])];

        const [firstTag, ...restTags] = profileState.businessCategories;

        const searchArray =
            profileState?.businessCategories.length < 3
                ? restTags
                : profileState.businessCategories;

        const initialReduceArray: TagLineType[] = [
            { elements: [], overallWidth: 0, id: 1 },
            {
                elements: firstTag && profileState.businessCategories.length < 3 ? [firstTag] : [],
                overallWidth: 0,
                id: 2,
            },
            { elements: [], overallWidth: 0, id: 3 },
        ];

        return initialArray?.reduce((acc: TagLineType[], element, index) => {
            const targetCategory = searchArray.find((_, categoryIndex) => categoryIndex === index)!;

            if (!targetCategory) return acc;

            const rect = element.getBoundingClientRect();

            const findLineIndex = acc.findIndex(line => line.overallWidth + rect.width < 300 - 32);

            return acc.map((line, indexLine) => {
                if (indexLine === findLineIndex) {
                    return {
                        id: line.id,
                        overallWidth: line.overallWidth + rect.width,
                        elements: [...line.elements, targetCategory],
                    };
                }
                if (findLineIndex === -1 && indexLine === 2) {
                    return {
                        id: line.id,
                        overallWidth: line.overallWidth + rect.width,
                        elements: [...line.elements, targetCategory],
                    };
                }

                return line;
            });
        }, initialReduceArray);
    }, [isNeedToRenderSeeAllTags, profileState?.businessCategories]);

    const renderInitialProfileTags = useMemo(
        () =>
            profileState?.businessCategories.map((category: BusinessCategory) => (
                <BusinessCategoryItem key={category.key} category={category} />
            )),
        [profileState?.businessCategories],
    );

    const renderTagsWithOutHidden = useMemo(
        () =>
            hideData.slice(0, 2).map((elementsData, index) => (
                <CustomGrid
                    key={elementsData.id}
                    container
                    alignItems="flex-start"
                    justifyContent="flex-end"
                    alignContent="flex-start"
                    gap={1.25}
                >
                    {elementsData.elements.map((category: BusinessCategory) => (
                        <BusinessCategoryItem
                            className={clsx({
                                [styles.businessTag]:
                                    index === 1 && profileState?.businessCategories.length < 3,
                            })}
                            key={category.key}
                            category={category}
                        />
                    ))}
                    {index === 1 && Boolean(hideData[2]?.elements?.length) && (
                        <TagWrapper
                            ref={businessTagsRef}
                            className={styles.showMoreTags}
                            onMouseEnter={handleToggleMoreTags}
                            onMouseLeave={handleToggleMoreTags}
                        >
                            <CustomTypography className={styles.numberOfHiddenTags}>
                                + {hideData[2]?.elements?.length}
                            </CustomTypography>
                        </TagWrapper>
                    )}
                </CustomGrid>
            )),
        [hideData],
    );

    const renderHiddenTags = useMemo(
        () =>
            hideData.slice(2, 3).map(elementsData => (
                <CustomGrid
                    key={elementsData.id}
                    container
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    alignContent="flex-start"
                    gap={1.25}
                    className={styles.moreTags}
                >
                    {elementsData?.elements?.map((category: BusinessCategory) => (
                        <BusinessCategoryItem
                            className={styles.hiddenBusinessTag}
                            key={category.key}
                            category={category}
                        />
                    ))}
                </CustomGrid>
            )),
        [hideData],
    );

    return (
        <CustomBox className={styles.tagsWrapper}>
            <CustomGrid
                container
                ref={hiddenBusinessTagsRef}
                alignItems="flex-start"
                justifyContent="flex-end"
                alignContent="flex-start"
                gap={1.25}
                className={clsx(styles.businessCategoryTags, styles.hiddenTags)}
            >
                {renderInitialProfileTags}
            </CustomGrid>
            <CustomGrid
                container
                alignItems="flex-start"
                justifyContent="flex-end"
                alignContent="flex-start"
                gap={1.25}
                className={styles.businessCategoryTags}
            >
                {renderTagsWithOutHidden}
            </CustomGrid>
            <CustomPopper id="businessTags" open={openMoreTags} anchorEl={businessTagsRef.current}>
                <CustomPaper className={styles.hiddenTags}>
                    <CustomGrid container gap={1.25}>
                        {renderHiddenTags}
                    </CustomGrid>
                </CustomPaper>
            </CustomPopper>
        </CustomBox>
    );
});

export { ProfileBusinessTags };
