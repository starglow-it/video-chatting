import {
	memo, useCallback, useMemo
} from 'react';
import {
	FileRejection, useDropzone 
} from 'react-dropzone';
import clsx from 'clsx';

// shared
import {
	ACCEPT_MIMES_AUDIO, MAX_SIZE_AUDIO_MB 
} from 'shared-const';
import { getFileSizeValue } from 'shared-utils';
import { FileSizeTypesEnum } from 'shared-types';

import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { ArrowLeftIcon } from 'shared-frontend/icons/OtherIcons/ArrowLeftIcon';
import { ArrowRightIcon } from 'shared-frontend/icons/OtherIcons/ArrowRightIcon';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { CustomIconButton } from 'shared-frontend/library/custom/CustomIconButton';
import { RoundCloseIcon } from 'shared-frontend/icons/RoundIcons/RoundCloseIcon';

// components
import { Translation } from '@components/Translation/Translation';
import { TemplateSoundPlayer } from '@components/CreateRoom/TemplateSoundPlayer/TemplateSoundPlayer';
import { UploadDragFileOverlay } from '@components/UploadDragFileOverlay/UploadDragFileOverlay';

// stores
import { addNotificationEvent } from '../../../store';

// styles
import styles from './TemplateSound.module.scss';

// types
import { TemplateSoundProps } from './TemplateSound.types';

import {
	NotificationType, Notification 
} from '../../../store/types';

const MAX_SIZE_AUDIO = getFileSizeValue({
	sizeType: FileSizeTypesEnum.megabyte,
	amount: MAX_SIZE_AUDIO_MB,
});

const TemplateSound = memo(
	({
		src,
		 isLoading,
		fileName,
		onRemove,
		onNextStep,
		onPreviousStep,
		onFileUploaded,
	}: TemplateSoundProps) => {
		const handleTemplateSoundUploaded = useCallback(
			(files: File[], fileRejections: FileRejection[]) => {
				const errorMessage: Notification = {
					type: NotificationType.UploadFileFail,
					withErrorIcon: true,
					message: '',
				};

				const isMimeError =
                    fileRejections[0]?.errors?.[0]?.code ===
                    'file-invalid-type';
				const isSizeError =
                    fileRejections[0]?.errors?.[0]?.code === 'file-too-large';

				if (files.length > 1) {
					errorMessage.message = 'uploadBackgroundSound.manyFiles';
				} else if (isMimeError) {
					errorMessage.message =
                        'uploadBackgroundSound.invalidFormat';
				} else if (isSizeError) {
					errorMessage.message = 'uploadBackgroundSound.maxSize';
					errorMessage.messageOptions = {
						max: MAX_SIZE_AUDIO_MB,
					};
				}

				if (errorMessage?.message) {
					addNotificationEvent(errorMessage);
					return;
				}

				onFileUploaded(files[0]);
			},
			[],
		);

		const {
			getRootProps, getInputProps, isDragActive 
		} = useDropzone({
			maxFiles: 1,
			maxSize: MAX_SIZE_AUDIO,
			accept: ACCEPT_MIMES_AUDIO,
			onDrop: handleTemplateSoundUploaded,
			noDrag: false,
		});

		const {
			onClick, ...rootProps 
		} = getRootProps();

		const handleRemoveBackgroundSound = useCallback(() => {
			onRemove?.();
		}, []);

		const dragFallbackComponent = useMemo(
			() =>
				isDragActive ? (
					<UploadDragFileOverlay title="uploadBackgroundAudio.title" />
				) : (
					<CustomPaper
						variant="black-glass"
						className={styles.paper}
					>
						<CustomGrid
							container
							direction="column"
							justifyContent="center"
							alignItems="center"
						>
							<CustomTypography
								textAlign="center"
								variant="h2bold"
								color="colors.white.primary"
							>
								<Translation
									nameSpace="rooms"
									translation="uploadSound.title"
								/>
							</CustomTypography>
							<CustomTypography
								className={styles.text}
								textAlign="center"
								color="colors.grayscale.normal"
							>
								<Translation
									nameSpace="rooms"
									translation="uploadSound.text"
								/>
							</CustomTypography>
							<CustomButton
								isLoading={isLoading}
								className={styles.uploadButton}
								onClick={onClick}
								label={
									<Translation
										nameSpace="common"
										translation="buttons.upload"
									/>
								}
							/>
						</CustomGrid>
					</CustomPaper>
				),
			[isLoading, isDragActive],
		);

		return (
			<CustomGrid
				container
				justifyContent="center"
				alignItems="center"
				className={styles.wrapper}
				{...rootProps}
			>
				<input {...getInputProps()} />
				{src ? (
					<CustomPaper
						variant="black-glass"
						className={clsx(styles.paper, styles.uploadedAudio)}
					>
						<TemplateSoundPlayer
							fileName={fileName}
							src={src}
						/>

						<ConditionalRender condition={!isLoading}>
							<CustomIconButton
								className={styles.removeIcon}
								disableRipple
								onClick={handleRemoveBackgroundSound}
							>
								<RoundCloseIcon
									className={styles.icon}
									width="24px"
									height="24px"
								/>
							</CustomIconButton>
						</ConditionalRender>
					</CustomPaper>
				) : (
					dragFallbackComponent
				)}
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
					<ConditionalRender condition={Boolean(src)}>
						<CustomButton
							variant="custom-gray"
							isLoading={isLoading}
							label={
								<Translation
									nameSpace="common"
									translation="buttons.change"
								/>
							}
							className={styles.button}
							onClick={onClick}
						/>
					</ConditionalRender>
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
	},
);

TemplateSound.displayName = 'TemplateSound';

export { TemplateSound };
