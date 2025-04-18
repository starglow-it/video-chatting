import React, {
	memo, useEffect, useMemo, useRef, useState 
} from 'react';
import clsx from 'clsx';

// hooks
import {
	useToggle 
} from '../../../hooks/useToggle';

// custom
import {CustomGrid} from "../../custom/CustomGrid";
import {CustomTypography} from "../../custom/CustomTypography";
import {CustomBox} from "../../custom/CustomBox";
import {CustomPaper} from "../../custom/CustomPaper";
import {CustomPopper} from "../../custom/CustomPopper";
import {BusinessCategoryItem} from "../BusinessCategoryItem";
import {TagWrapper} from "../TagWrapper";

// styles
import styles from './BusinessCategoryTagsClip.module.scss';

// types
import {
	IBusinessCategory
} from 'shared-types';

const Component = ({
	lines,
	tags = [],
	maxWidth,
}: {
    lines: number;
    tags: IBusinessCategory[];
    maxWidth: number;
}) => {
	const [isNeedToRenderSeeAllTags, setIsNeedToRenderSeeAllTags] =
        useState<boolean>(false);

	const businessTagsRef = useRef<HTMLDivElement>(null);
	const hiddenBusinessTagsRef = useRef<HTMLDivElement>(null);

	const {
		value: openMoreTags, 
		onToggleSwitch: handleToggleMoreTags 
	} =
        useToggle(false);

	useEffect(() => {
		setTimeout(() => {
			setIsNeedToRenderSeeAllTags(true);
		}, 100);
	}, []);

	const hideData = useMemo(() => {
		const initialArray = [
			...(hiddenBusinessTagsRef?.current?.children || []),
		];

		const [firstTag, ...restTags] = tags || [];

		const searchArray = tags.length < 3 ? restTags : tags;

		const initialReduceArray = new Array(lines + 1)
			.fill({
				elements: [],
				overallWidth: 0,
			})
			.map((line, index) =>
				index === lines - 1 && firstTag && (tags?.length || 0) < 3
					? {
						...line,
						elements: [firstTag],
					}
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
				return line;
			});
		}, initialReduceArray);
	}, [isNeedToRenderSeeAllTags, tags]);

	const renderInitialTags = useMemo(
		() =>
			tags?.map((category: IBusinessCategory) => (
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
				<CustomGrid
					key={Math.random()}
					container
					gap={1.25}
				>
					{elementsData.elements.map(
						(category: IBusinessCategory) => (
							<BusinessCategoryItem
								className={clsx({
									[styles.businessTag]: index === 0,
								})}
								key={category.key}
								category={category}
								typographyVariant="body2"
							/>
						),
					)}
					{index === lines - 1 &&
                        Boolean(hideData[lines]?.elements?.length) && (
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
			<CustomGrid
				container
				gap={1.25}
				className={styles.moreTags}
			>
				{elementsData?.elements?.map((category: IBusinessCategory) => (
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
				className={clsx(
					styles.businessCategoryTags,
					styles.hiddenInitialTags,
				)}
			>
				{renderInitialTags}
			</CustomGrid>
			<CustomGrid
				container
				gap={1.25}
				className={styles.businessCategoryTags}
			>
				{renderTagsWithOutHidden}
			</CustomGrid>
			<CustomPopper
				id="hiddenBusinessTags"
				open={openMoreTags}
				anchorEl={businessTagsRef.current}
			>
				<CustomPaper className={styles.hiddenTags}>
					<CustomGrid
						container
						gap={1.25}
					>
						{renderHiddenTags}
					</CustomGrid>
				</CustomPaper>
			</CustomPopper>
		</CustomBox>
	);
};

const BusinessCategoryTagsClip = memo(Component);

export default BusinessCategoryTagsClip;
