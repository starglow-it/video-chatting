import {
	memo, useCallback, useMemo 
} from 'react';
import clsx from 'clsx';
import {
	FileRejection, useDropzone 
} from 'react-dropzone';

// shared
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { CustomTooltip } from 'shared-frontend/library/custom/CustomTooltip';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { ArrowRightIcon } from 'shared-frontend/icons/OtherIcons/ArrowRightIcon';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';

// utils
import { getFileSizeValue } from 'shared-utils';

// const
import {
	ACCEPT_MIMES,
	ACCEPT_MIMES_IMAGE,
	ACCEPT_MIMES_VIDEO,
	MAX_SIZE_IMAGE_MB,
	MAX_SIZE_VIDEO_MB,
} from 'shared-const';

// types
import { FileSizeTypesEnum } from 'shared-types';

// components
import { Translation } from '@components/Translation/Translation';

import { UploadDragFileOverlay } from '@components/UploadDragFileOverlay/UploadDragFileOverlay';

import { addNotificationEvent } from '../../../store';
import {
	Notification, NotificationType 
} from '../../../store/types';

import { UploadBackgroundProps } from './UploadBackground.types';

import styles from './UploadBackground.module.scss';

export const MAX_SIZE_IMAGE = getFileSizeValue({
	sizeType: FileSizeTypesEnum.megabyte,
	amount: MAX_SIZE_IMAGE_MB,
});
export const MAX_SIZE_VIDEO = getFileSizeValue({
	sizeType: FileSizeTypesEnum.megabyte,
	amount: MAX_SIZE_VIDEO_MB,
});

const Component = ({
	isFileExists,
	onNextStep,
	isUploadDisabled,
	onFileUploaded,
}: UploadBackgroundProps) => {
	const generateFileUploadError = useCallback(
		(rejectedFiles: FileRejection[], total: number) => {
			if (!rejectedFiles.length) {
				return;
			}

			if (total > 1) {
				addNotificationEvent({
					type: NotificationType.UploadFileFail,
					message: 'createRoom.uploadBackground.manyFiles',
					withErrorIcon: true,
				});
				return;
			}

			const rejectedFile = rejectedFiles[0]?.file;

			if (!rejectedFile) {
				return;
			}

			const fileType = rejectedFile.type.split('/')[0];

			if (fileType !== 'image' && fileType !== 'video') {
				return;
			}

			const maxSize =
                fileType === 'image' ? MAX_SIZE_IMAGE : MAX_SIZE_VIDEO;
			const maxSizeMB =
                fileType === 'image' ? MAX_SIZE_IMAGE_MB : MAX_SIZE_VIDEO_MB;
			const isSizeExceeded = rejectedFile.size > maxSize;
			const isAcceptedMIME =
                fileType === 'image'
                	? ACCEPT_MIMES_IMAGE[rejectedFile.type]
                	: ACCEPT_MIMES_VIDEO[rejectedFile.type];

			const notification: Notification = {
				type: NotificationType.UploadFileFail,
				messageOptions: {
					max: maxSizeMB,
				},
				withErrorIcon: true,
				message: '',
			};

			if (isAcceptedMIME) {
				notification.message = `uploadBackground.${fileType}.maxSize`;
			} else if (!isAcceptedMIME && isSizeExceeded) {
				notification.message = `uploadBackground.${fileType}.general`;
			} else {
				notification.message = `uploadBackground.${fileType}.invalidFormat`;
			}

			addNotificationEvent(notification);
		},
		[],
	);

	const handleSetFileData = useCallback(
		async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
			const totalFiles = acceptedFiles.length + rejectedFiles.length;

			if (rejectedFiles.length || totalFiles > 1) {
				generateFileUploadError(
					rejectedFiles,
					acceptedFiles.length + rejectedFiles.length,
				);
				return;
			}

			const file = acceptedFiles[0];

			if (ACCEPT_MIMES_IMAGE[file.type] && file.size > MAX_SIZE_IMAGE) {
				generateFileUploadError(
					[
						{
							file,
						},
					],
					acceptedFiles.length + rejectedFiles.length,
				);
				return;
			}

			onFileUploaded(file);
		},
		[generateFileUploadError, onFileUploaded],
	);

	const {
		getRootProps, getInputProps, isDragActive 
	} = useDropzone({
		maxFiles: 1,
		maxSize: Math.max(MAX_SIZE_IMAGE, MAX_SIZE_VIDEO),
		accept: ACCEPT_MIMES,
		onDrop: handleSetFileData,
		noDrag: false,
	});

	const {
		onClick, ...rootProps 
	} = getRootProps();

	const fallbackComponent = useMemo(
		() =>
			!isFileExists ? (
				<CustomGrid
					container
					direction="column"
					alignItems="center"
					justifyContent="center"
					className={styles.uploadDescription}
				>
					<CustomTypography
						className={styles.title}
						variant="h2bold"
					>
						<Translation
							nameSpace="rooms"
							translation="uploadBackground.title"
						/>
					</CustomTypography>
					<CustomTypography
						className={styles.description}
						color="colors.grayscale.semidark"
					>
						<Translation
							nameSpace="rooms"
							translation="uploadBackground.description"
						/>
					</CustomTypography>
					<CustomTooltip
						arrow
						open
						placement="bottom"
						variant="black-glass"
						title={
							<CustomGrid
								container
								direction="column"
								alignItems="center"
								gap={1}
							>
								<CustomTypography variant="body2bold">
									<Translation
										nameSpace="rooms"
										translation="uploadBackground.tip.title"
									/>
								</CustomTypography>
								<CustomGrid
									item
									container
									direction="column"
									alignItems="center"
								>
									<CustomTypography variant="body2">
										<Translation
											nameSpace="rooms"
											translation="uploadBackground.tip.resolution"
										/>
									</CustomTypography>
									<CustomTypography variant="body2">
										<Translation
											nameSpace="rooms"
											translation="uploadBackground.tip.imageRestricts"
											options={{
												maxSize: MAX_SIZE_IMAGE_MB,
											}}
										/>
									</CustomTypography>
									<CustomTypography variant="body2">
										<Translation
											nameSpace="rooms"
											translation="uploadBackground.tip.videoRestricts"
											options={{
												maxSize: MAX_SIZE_VIDEO_MB,
											}}
										/>
									</CustomTypography>
								</CustomGrid>
							</CustomGrid>
						}
						popperClassName={styles.popper}
					>
						<CustomButton
							label={
								<Translation
									nameSpace="rooms"
									translation="uploadBackground.actions.upload"
								/>
							}
							className={styles.button}
							onClick={onClick}
						/>
					</CustomTooltip>
				</CustomGrid>
			) : (
				<CustomGrid
					container
					gap={1.5}
					flexWrap="nowrap"
					justifyContent="center"
					className={styles.buttonsGroup}
				>
					<CustomButton
						isLoading={isUploadDisabled}
						variant="custom-gray"
						label={
							<Translation
								nameSpace="rooms"
								translation="uploadBackground.actions.change"
							/>
						}
						className={styles.button}
						onClick={onClick}
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
			),
		[isFileExists, isUploadDisabled, onFileUploaded],
	);

	return (
		<CustomGrid
			container
			className={clsx(styles.container)}
			{...rootProps}
		>
			<input {...getInputProps()} />
			{isDragActive ? (
				<UploadDragFileOverlay title="uploadBackground.title" />
			) : (
				fallbackComponent
			)}
		</CustomGrid>
	);
};

export const UploadBackground = memo(Component);
