import React, {
	memo, useMemo
} from 'react';
import {
	useFormContext, useWatch
} from "react-hook-form";

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

// styles
import styles from './TemplateLinks.module.scss';
import {TemplateLinkItem} from "@components/CreateRoom/TemplateLinks/TemplateLinkItem";
import {CustomTypography} from "shared-frontend/library/custom/CustomTypography";
import {Translation} from "@components/Translation/Translation";
import {CustomPaper} from "shared-frontend/library/custom/CustomPaper";

export type TemplatesLinksProps = {
    onNextStep: () => void;
    onPreviousStep: () => void;
	onRemoveLink: (index: number) => void;
};

const Component = ({
	onNextStep, 
	onPreviousStep,
   	onRemoveLink
}: TemplatesLinksProps) => {
	const {
		control,
	} = useFormContext();

	const templateLinks = useWatch({
		control,
		name: 'templateLinks',
	});

	const renderLinks = useMemo(() => {
		return templateLinks.map((link, index) => {
			return <TemplateLinkItem
				index={index}
				onAccept={() => {}}
				onRemove={onRemoveLink}
				onToggleActive={() => {}}
				url={link?.value}
				key={link?.key}
				top={link.top}
				left={link.left}
				isDraggable
			/>
		})
	}, [templateLinks]);

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
