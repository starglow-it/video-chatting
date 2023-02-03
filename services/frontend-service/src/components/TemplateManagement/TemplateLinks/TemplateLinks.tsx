import {
	memo, useCallback, useMemo 
} from 'react';
import clsx from 'clsx';
import {
	useFieldArray, useFormContext 
} from 'react-hook-form';

import { getRandomNumber } from 'shared-utils';

// shared
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { ArrowLeftIcon } from 'shared-frontend/icons/OtherIcons/ArrowLeftIcon';
import { ArrowRightIcon } from 'shared-frontend/icons/OtherIcons/ArrowRightIcon';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomLinkIcon } from 'shared-frontend/icons/OtherIcons/CustomLinkIcon';
import { CustomTooltip } from 'shared-frontend/library/custom/CustomTooltip';

import {Translation} from "@library/common/Translation/Translation";

// styles
import styles from './TemplateLinks.module.scss';

import { TemplateLinkItem } from './TemplateLinkItem';
import { TemplatesLinksProps } from './TemplateLinks.types';

const Component = ({
	onNextStep, onPreviousStep 
}: TemplatesLinksProps) => {
	const {
		control 
	} = useFormContext();

	const {
		fields, append, remove 
	} = useFieldArray({
		control,
		name: 'templateLinks',
	});

	const handleRemoveTemplateLink = useCallback((index: number) => {
		remove(index);
	}, []);

	const renderLinks = useMemo(
		() =>
			fields.map((link, index) => (
				<TemplateLinkItem
					key={link?.key}
					index={index}
					onRemove={handleRemoveTemplateLink}
					data={link}
					isDraggable
				/>
			)),
		[fields],
	);

	const handleAddLinkInput = useCallback(() => {
		append({
			value: '',
			key: getRandomNumber(100),
			top: 0.5,
			left: 0.5,
		});
	}, []);

	const isAddLinkDisabled = fields.length === 5;

	return (
		<CustomGrid
			container
			className={styles.wrapper}
		>
			<CustomTooltip
				title={
					isAddLinkDisabled ? (
						<Translation
							nameSpace="rooms"
							translation="tooltips.addLinkDisabled"
						/>
					) : (
						''
					)
				}
			>
				<CustomButton
					onClick={handleAddLinkInput}
					className={clsx(styles.addLinkButton, {
						[styles.disabled]: isAddLinkDisabled,
					})}
					label={
						<CustomTypography variant="body2">
							<Translation
								nameSpace="createRoom"
								translation="addLink"
							/>
						</CustomTypography>
					}
					Icon={<CustomLinkIcon
						width="24px"
						height="24px"
					      />}
				/>
			</CustomTooltip>
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
					Icon={<ArrowLeftIcon
						width="32px"
						height="32px"
					      />}
					className={styles.actionButton}
					onAction={onPreviousStep}
				/>
				<ActionButton
					variant="accept"
					Icon={<ArrowRightIcon
						width="32px"
						height="32px"
					      />}
					className={styles.actionButton}
					onAction={onNextStep}
				/>
			</CustomGrid>
		</CustomGrid>
	);
};

export const TemplateLinks = memo(Component);
