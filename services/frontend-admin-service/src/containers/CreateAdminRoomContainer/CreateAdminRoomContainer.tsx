import React, {
	memo, useCallback, useEffect, useRef
} from 'react';
import {
	FormProvider,
	useFieldArray,
	useForm,
	useWatch,
} from 'react-hook-form';
import * as yup from 'yup';
import {
	useStore 
} from 'effector-react';
import {
	useRouter 
} from 'next/router';
import clsx from "clsx";

// shared
import {
	participantsNumberSchema,
	participantsPositionsSchema,
	simpleStringSchema,
	simpleStringSchemaWithLength,
	tagsSchema, templatePriceSchema,
	validateSocialLink,
} from 'shared-frontend/validation';
import {getRandomNumber} from "shared-utils";
import {
	MAX_DESCRIPTION_LENGTH 
} from 'shared-const';

import {
	CustomButton 
} from 'shared-frontend/library/custom/CustomButton';
import {
	CustomGrid 
} from 'shared-frontend/library/custom/CustomGrid';
import {
	CustomPaper 
} from 'shared-frontend/library/custom/CustomPaper';
import {
	CustomTooltip
} from "shared-frontend/library/custom/CustomTooltip";
import {
	ActionButton
} from "shared-frontend/library/common/ActionButton";
import {
	ValuesSwitcher
} from "shared-frontend/library/common/ValuesSwitcher";
import {
	CustomFade
} from "shared-frontend/library/custom/CustomFade";
import {
	CustomTypography
} from 'shared-frontend/library/custom/CustomTypography';
import {
	CustomLinkIcon 
} from 'shared-frontend/icons/OtherIcons/CustomLinkIcon';
import {
	CloseIcon 
} from 'shared-frontend/icons/OtherIcons/CloseIcon';
import {
	useYupValidationResolver
} from "shared-frontend/hooks/useYupValidationResolver";
import {
	useValueSwitcher
} from "shared-frontend/hooks/useValuesSwitcher";
import { CustomAudio } from '@components/CreateRoom/CustomAudio/CustomAudio';

// components
import {
	TemplateBackground 
} from '@components/CreateRoom/TemplateBackground/TemplateBackground';
import {
	Translation 
} from '@components/Translation/Translation';
import {
	UploadBackground 
} from '@components/CreateRoom/UploadBackground/UploadBackground';
import {
	CommonTemplateSettings 
} from '@components/CreateRoom/CommonTemplateSettings/CommonTemplateSettings';
import {
	AttendeesPositions 
} from '@components/CreateRoom/AttendeesPositions/AttendeesPositions';
import {
	TemplateLinks 
} from '@components/CreateRoom/TemplateLinks/TemplateLinks';
import { TemplateSound } from '@components/CreateRoom/TemplateSound/TemplateSound';
import {TemplatePrice} from "@components/CreateRoom/TemplatePrice/TemplatePrice";

// stores
import {
	$businessCategoriesStore,
	$commonTemplateStore,
	addNotificationEvent,
	getBusinessCategoriesFx,
	getCommonTemplateFx,
	initWindowListeners,
	removeWindowListeners,
	openAdminDialogEvent,
	uploadTemplateFileFx,
	updateCommonTemplateDataEvent,
} from '../../store';

// styles
import styles from './CreateAdminRoomContainer.module.scss';

// types
import {
	AdminDialogsEnum, NotificationType 
} from '../../store/types';

import {ValuesSwitcherItem} from "shared-frontend/types";
import {ImagePlaceholderIcon} from "shared-frontend/icons/OtherIcons/ImagePlaceholderIcon";
import {TemplatePreview} from "@components/CreateRoom/TemplatePreview/TemplatePreview";
import { usePrevious } from 'shared-frontend/hooks/usePrevious';

// utils
enum TabsValues {
    Background = 1,
    Settings = 2,
    Attendees = 3,
    Sound = 4,
    Links = 5,
    Monetization = 6,
    Preview = 7,
}

enum TabsLabels {
    Background = 'Background',
    Settings = 'Settings',
    Attendees = 'Attendees',
    Sound = 'Sound',
    Links = 'Links',
    Monetization = 'Monetization',
    Preview = 'Preview',
}

type ValuesSwitcherAlias = ValuesSwitcherItem<TabsValues, TabsLabels>;

const tabs: ValuesSwitcherAlias[] = [
	{
		id: 1,
		value: TabsValues.Background,
		label: TabsLabels.Background,
	},
	{
		id: 2,
		value: TabsValues.Settings,
		label: TabsLabels.Settings,
	},
	{
		id: 3,
		value: TabsValues.Attendees,
		label: TabsLabels.Attendees,
	},
	{
		id: 4,
		value: TabsValues.Sound,
		label: TabsLabels.Sound,
	},
	{
		id: 5,
		value: TabsValues.Links,
		label: TabsLabels.Links,
	},
	{
		id: 6,
		value: TabsValues.Monetization,
		label: TabsLabels.Monetization,
	},
	{
		id: 7,
		value: TabsValues.Preview,
		label: TabsLabels.Preview,
	},
];

const defaultValues = {
	background: '',
	backgroundSound: '',
	name: '',
	description: '',
	tags: [],
	participantsNumber: 1,
	participantsPositions: [
		{
			left: 50,
			top: 50,
			id: '1',
		},
	],
	templateLinks: [],
	type: 'free',
	templatePrice: undefined,
};

const validationSchema = yup.object({
	background: simpleStringSchema(),
	backgroundSound: simpleStringSchema(),
	name: simpleStringSchema(),
	description: simpleStringSchemaWithLength(MAX_DESCRIPTION_LENGTH).required(
		'required',
	),
	tags: tagsSchema(),
	participantsNumber: participantsNumberSchema().required('required'),
	participantsPositions: participantsPositionsSchema(),
	templateLinks: yup.array().of(validateSocialLink()),
	type: simpleStringSchema(),
	templatePrice: templatePriceSchema(0.99, 999999),
});

const Component = () => {
	const router = useRouter();

	const {
		state: commonTemplate 
	} = useStore($commonTemplateStore);

	const {
		state: categories
	} = useStore($businessCategoriesStore);

	const prevFieldsCount = useRef(0);


	const isFileUploading = useStore(uploadTemplateFileFx.pending);

	const {
		activeItem,
		onValueChange,
		onNextValue,
		onPreviousValue,
	} = useValueSwitcher<TabsValues, TabsLabels>({
		values: tabs,
		initialValue: tabs[0].value,
	});

	const resolver = useYupValidationResolver(validationSchema, {
		reduceArrayErrors: true,
	});

	const methods = useForm({
		defaultValues,
		resolver,
		mode: 'onBlur',
	});

	const {
		control, 
		handleSubmit, 
		setValue, 
		trigger,
		setFocus
	} = methods;

	const {
		fields,
		append,
		remove
	} = useFieldArray({
		control,
		name: 'templateLinks',
	});

	const background = useWatch({
		control,
		name: 'background',
	});

	const templateName = useWatch({
		control,
		name: 'name',
	});

	const type = useWatch({
		control,
		name: 'type',
	});

	const backgroundSound = useWatch({
		control,
		name: 'backgroundSound',
	});

	const templateLinks = useWatch({
		control,
		name: 'templateLinks',
	});

	const participantsNumber = useWatch({
		control,
		name: 'participantsNumber',
	});

	const participantsPositions = useWatch({
		control,
		name: 'participantsPositions',
	});

	const tags = useWatch({
		control,
		name: 'tags',
	});

	const description = useWatch({
		control,
		name: 'description',
	});

	const previousParticipantsNumber = usePrevious(participantsNumber);

	useEffect(() => {
		getCommonTemplateFx({
			templateId: router.query.roomId as string,
		});
		getBusinessCategoriesFx({
		});

		initWindowListeners();

		return () => {
			removeWindowListeners();
		};
	}, [router.isReady]);

	useEffect(() => {
		setValue('backgroundSound', commonTemplate?.sound?.url);
	}, [commonTemplate?.sound?.url]);

	useEffect(() => {
		if (!previousParticipantsNumber || participantsNumber === previousParticipantsNumber) return;

		if (previousParticipantsNumber > participantsNumber) {
			setValue('participantsPositions', participantsPositions.slice(0, participantsNumber));
			return;
		}

		const newPositions = [
			...participantsPositions,
			...new Array(participantsNumber - participantsPositions.length ).fill({}).keys()];

		setValue('participantsPositions', newPositions.map(data => data.id ? data : ({
			left: 50,
			top: 50,
			id: getRandomNumber(10000).toString(),
		}) ));

	}, [
		participantsNumber,
		previousParticipantsNumber,
		participantsPositions,
	]);

	const handleValueChange = useCallback(
		async (item: ValuesSwitcherAlias) => {
			if (
				item.value > TabsValues.Background &&
                !(commonTemplate?.draftUrl || background)
			) {
				addNotificationEvent({
					type: NotificationType.BackgroundFileShouldBeUploaded,
					message: 'uploadBackground.shouldBeUploaded',
					withErrorIcon: true,
				});
				return;
			}

			if (item.value > TabsValues.Settings) {
				const response = await trigger(['description', 'name']);
				onValueChange(response ? item : tabs[1]);
				return;
			}

			onValueChange(item);
		},
		[background, commonTemplate?.draftUrl],
	);

	const onSubmit = useCallback(
		handleSubmit(data => {
			console.log(data);
		}),
		[],
	);

	const handleFileUploaded = useCallback(
		async (file: File) => {
			setValue('background', '');
			updateCommonTemplateDataEvent({
				draftUrl: '',
				draftPreviewUrls: [],
				templateType: file.type.split('/')[0] === 'video' ? 'video' : 'image'
			});

			setValue('background', URL.createObjectURL(file));

			if (commonTemplate?.id) {
				uploadTemplateFileFx({
					file,
					templateId: commonTemplate.id,
				});
			}
		},
		[commonTemplate?.id],
	);

	const handleSoundUploaded = useCallback(
		async (file: File) => {
			setValue('backgroundSound', '');

			updateCommonTemplateDataEvent({
				sound: null,
			});

			setValue('backgroundSound', URL.createObjectURL(file));

			if (commonTemplate?.id) {
				await uploadTemplateFileFx({
					file,
					templateId: commonTemplate.id,
				});
			}
		},
		[commonTemplate?.id],
	);

	const handleOpenCancelConfirmationDialog = useCallback(() => {
		openAdminDialogEvent(AdminDialogsEnum.cancelCreateRoomDialog);
	}, []);

	useEffect(() => {
		if (fields.length) {
			prevFieldsCount.current = fields.length;
			setFocus(`templatesLinks[${fields.length - 1}].value`);
		}
	}, [fields]);

	const handleAddLinkInput = useCallback(() => {
		append({
			value: '',
			key: getRandomNumber(100),
			top: 0.5,
			left: 0.5,
		});
	}, [fields]);

	const handleRemoveTemplateLink = useCallback((index: number) => {
		remove(index);
	}, []);

	const handleRemoveSound = useCallback(() => {

		// TODO: removeRemoteUrl
		updateCommonTemplateDataEvent({
			sound: null,
		});
		setValue('backgroundSound', '');
	}, []);

	const isAddLinkDisabled = fields.length === 5;

	return (
		<CustomGrid
			container
			className={styles.wrapper}
		>
			<FormProvider {...methods}>
				<form className={styles.form} onSubmit={onSubmit}>
					<TemplateBackground
						templateType={commonTemplate?.templateType ?? 'video'}
						url={commonTemplate?.draftUrl || background}
					/>
					<CustomAudio
						isMuted={isFileUploading || activeItem.label === TabsLabels.Sound}
						src={commonTemplate?.sound?.url}
					/>

					<CustomGrid
						container
						wrap="nowrap"
						justifyContent="flex-end"
						gap={1.5}
						className={styles.navigationPaper}
					>
						<CustomGrid container gap={1.5} className={styles.infoWrapper}>
							<CustomGrid
								item
								container
								flexShrink={0}
								alignItems="center"
								justifyContent="center"
								className={styles.imagePlaceholder}
							>
								<ImagePlaceholderIcon width="34px" height="34px" />
							</CustomGrid>

							<CustomPaper variant="black-glass" className={styles.mainInfo}>
								<CustomGrid container direction="column">
									{templateName ? (
										<CustomTypography
											color="colors.white.primary"
											className={styles.name}
										>
											{templateName}
										</CustomTypography>
									) : (
										<CustomTypography
											color="colors.white.primary"
										>
											<Translation
												nameSpace="rooms"
												translation="preview.roomName"
											/>
										</CustomTypography>
									)}
									{type
										? (
											<CustomTypography
												variant="body2"
												color="colors.green.primary"
												className={styles.type}
											>
												{type}
											</CustomTypography>
										)
										: null
									}
								</CustomGrid>
							</CustomPaper>
						</CustomGrid>

						<CustomPaper
							variant="black-glass"
							className={styles.paper}
						>
							<ValuesSwitcher<TabsValues, TabsLabels>
								values={tabs}
								activeValue={activeItem}
								onValueChanged={handleValueChange}
								variant="transparent"
								itemClassName={styles.switchItem}
								className={styles.switcherWrapper}
							/>
						</CustomPaper>

						<CustomFade
							key={TabsLabels.Links}
							open={activeItem.label === TabsLabels.Links}
							unmountOnExit
						>
							<CustomTooltip
								title={isAddLinkDisabled ?
									<Translation
										nameSpace="rooms"
										translation="tooltips.addLinkDisabled"
									/> : ''
								}
							>
								<CustomButton
									onClick={handleAddLinkInput}
									className={clsx(styles.addLinkButton, {[styles.disabled]: isAddLinkDisabled })}
									label={
										<CustomTypography variant="body2">
											<Translation
												nameSpace="rooms"
												translation="addLink"
											/>
										</CustomTypography>
									}
									Icon={
										<CustomLinkIcon
											width="24px"
											height="24px"
										/>
									}
								/>
							</CustomTooltip>
						</CustomFade>

						<CustomTooltip
							title={
								<Translation
									nameSpace="rooms"
									translation="tooltips.cancel"
								/>
							}
						>
							<ActionButton
								onAction={handleOpenCancelConfirmationDialog}
								Icon={
									<CloseIcon
										width="40px"
										height="40px"
									/>
								}
								className={styles.closeButton}
								variant="gray"
							/>
						</CustomTooltip>
					</CustomGrid>

					<CustomGrid className={styles.componentsWrapper}>
						<CustomFade
							key={TabsLabels.Background}
							open={activeItem.label === TabsLabels.Background}
							unmountOnExit
							className={styles.componentItem}
						>
							<UploadBackground
								isUploadDisabled={isFileUploading}
								isFileExists={Boolean(
									commonTemplate?.draftUrl || background,
								)}
								onNextStep={onNextValue}
								onFileUploaded={handleFileUploaded}
							/>
						</CustomFade>

						<CustomFade
							key={TabsLabels.Settings}
							open={activeItem.label === TabsLabels.Settings}
							unmountOnExit
							className={styles.componentItem}
						>
							<CommonTemplateSettings
								categories={categories.list}
								onNextStep={onNextValue}
								onPreviousStep={onPreviousValue}
							/>
						</CustomFade>

						<CustomFade
							key={TabsLabels.Attendees}
							open={activeItem.label === TabsLabels.Attendees}
							unmountOnExit
							className={styles.componentItem}
						>
							<AttendeesPositions
								onNextStep={onNextValue}
								onPreviousStep={onPreviousValue}
							/>
						</CustomFade>

						<CustomFade
							key={TabsLabels.Sound}
							open={activeItem.label === TabsLabels.Sound}
							unmountOnExit
							className={styles.componentItem}
						>
							<TemplateSound
								isUploadDisabled={isFileUploading}
								fileName={commonTemplate?.sound?.fileName}
								src={commonTemplate?.sound?.url || backgroundSound}
								onRemove={handleRemoveSound}
								onFileUploaded={handleSoundUploaded}
								onNextStep={onNextValue}
								onPreviousStep={onPreviousValue}
							/>
						</CustomFade>

						<CustomFade
							key={TabsLabels.Links}
							open={activeItem.label === TabsLabels.Links}
							unmountOnExit
							className={styles.componentItem}
						>
							<TemplateLinks
								links={templateLinks}
								onNextStep={onNextValue}
								onPreviousStep={onPreviousValue}
								onRemoveLink={handleRemoveTemplateLink}
							/>
						</CustomFade>

						<CustomFade
							key={TabsLabels.Monetization}
							open={activeItem.label === TabsLabels.Monetization}
							unmountOnExit
							className={styles.componentItem}
						>
							<TemplatePrice
								onNextStep={onNextValue}
								onPreviousStep={onPreviousValue}
							/>
						</CustomFade>

						<CustomFade
							key={TabsLabels.Preview}
							open={activeItem.label === TabsLabels.Preview}
							unmountOnExit
							className={styles.componentItem}
						>
							<TemplatePreview
								participantsPositions={participantsPositions}
								templateTags={tags}
								description={description}
								templateLinks={templateLinks}
								onPreviousStep={onPreviousValue}
							/>
						</CustomFade>
					</CustomGrid>
				</form>
			</FormProvider>
		</CustomGrid>
	);
};

export const CreateAdminRoomContainer = memo(Component);
