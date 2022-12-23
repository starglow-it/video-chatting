import React, {
	memo, useMemo
} from 'react';

// shared
import {
	CustomGrid 
} from 'shared-frontend/library/custom/CustomGrid';
import {
	ActionButton 
} from 'shared-frontend/library/common/ActionButton';
import {
	ArrowLeftIcon 
} from 'shared-frontend/icons/OtherIcons/ArrowLeftIcon';
import {
	ArrowRightIcon 
} from 'shared-frontend/icons/OtherIcons/ArrowRightIcon';
import {CustomPaper} from "shared-frontend/library/custom/CustomPaper";
import {CustomTypography} from "shared-frontend/library/custom/CustomTypography";

// styles
import styles from './TemplateLinks.module.scss';

import {TemplateLinkItem} from "./TemplateLinkItem";
import {Translation} from "@components/Translation/Translation";
import {TemplatesLinksProps} from "./TemplateLinks.types";

const Component = ({
   	links,
	onNextStep, 
	onPreviousStep,
   	onRemoveLink,
}: TemplatesLinksProps) => {
	const renderLinks = useMemo(() =>
		links.map((link, index) => (
			<TemplateLinkItem
				key={link?.key}
				index={index}
				onAccept={() => {}}
				onRemove={onRemoveLink}
				data={link}
				isDraggable
			/>
	)), [links]);

	return (
		<CustomGrid
			container
			className={styles.wrapper}
		>
			<CustomPaper
				variant="black-glass"
				className={styles.paper}
			>
				<CustomTypography
					variant="body2"
					color="colors.white.primary"
				>
					<Translation
						nameSpace="rooms"
						translation="templateLinks.title"
					/>
				</CustomTypography>
			</CustomPaper>
			{renderLinks}
			<CustomGrid
				container
				gap={1.5}
				flexWrap="nowrap"
				justifyContent="center"
				className={styles.buttonsGroup}
			>
				<ActionButton
					variant="gray"
					Icon={(
						<ArrowLeftIcon
							width="32px"
							height="32px"
					  	/>
					)}
					className={styles.actionButton}
					onAction={onPreviousStep}
				/>
				<ActionButton
					variant="accept"
					Icon={
						<ArrowRightIcon
							width="32px"
							height="32px"
						/>
					}
					className={styles.actionButton}
					onAction={onNextStep}
				/>
			</CustomGrid>
		</CustomGrid>
	);
};

export const TemplateLinks = memo(Component);
