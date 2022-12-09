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

// shared
import {
	participantsNumberSchema,
	participantsPositionsSchema,
	simpleStringSchema,
	simpleStringSchemaWithLength,
	tagsSchema,
	validateSocialLink,
} from 'shared-frontend/validation';

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

// stores
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
	$businessCategoriesStore,
	$commonTemplateStore,
	addNotificationEvent,
	getBusinessCategoriesFx,
	getCommonTemplateFx,
	initWindowListeners,
	removeWindowListeners,
	openAdminDialogEvent,
	uploadTemplateFileFx,
} from '../../store';

// styles
import styles from './CreateAdminRoomContainer.module.scss';

// types
import {
	AdminDialogsEnum, NotificationType 
} from '../../store/types';
import {getRandomNumber} from "shared-utils";
import clsx from "clsx";


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
};

const validationSchema = yup.object({
	background: simpleStringSchema(),
	description: simpleStringSchemaWithLength(MAX_DESCRIPTION_LENGTH).required(
		'required',
	),
	tags: tagsSchema(),
	participantsNumber: participantsNumberSchema().required('required'),
	participantsPositions: participantsPositionsSchema(),
	templateLinks: yup.array().of(validateSocialLink()),
});

const Component = () => {
	const router = useRouter();

	const {
		state: commonTemplate 
	} = useStore($commonTemplateStore);
	const {
		state: categories 
	} = useStore($businessCategoriesStore);

	const isFileUploading = useStore(uploadTemplateFileFx.pending);

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

	const background = useWatch({
		control,
		name: 'background',
	});

	const {
		fields, 
		append,
		remove
	} = useFieldArray({
		control,
		name: 'templateLinks',
	});

	const {
		activeItem,
		onValueChange,
		onNextValue,
		onPreviousValue,
	} = useValueSwitcher<TabsValues, TabsLabels>({
		values: tabs,
		initialValue: tabs[0].value,
	});

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
				const response = await trigger();
				onValueChange(response ? item : tabs[1]);
				return;
			}

			onValueChange(item);
		},
		[onValueChange, background, commonTemplate?.draftUrl],
	);

	const onSubmit = useCallback(
		handleSubmit(data => {
			console.log(data);
		}),
		[],
	);

	const handleFileUploaded = useCallback(
		async (file: File) => {
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

	const handleOpenCancelConfirmationDialog = useCallback(() => {
		openAdminDialogEvent(AdminDialogsEnum.cancelCreateRoomDialog);
	}, []);

	const prevFieldsCount = useRef(0);

	useEffect(() => {
		if (fields.length) {
			prevFieldsCount.current = fields.length;
			console.log('focus')
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

	const handleRemoveTemplateLink = useCallback((index) => {
		remove(index);
	}, []);

	const isAddLinkDisabled = fields.length === 5;

	return (
		<CustomGrid
			container
			className={styles.wrapper}
		>
			<FormProvider {...methods}>
				<form onSubmit={onSubmit}>
					<TemplateBackground
						url={commonTemplate?.draftUrl || background}
					/>

					<CustomGrid
						container
						wrap="nowrap"
						justifyContent="flex-end"
						gap={1.5}
						className={styles.navigationPaper}
					>
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
							key={TabsLabels.Links}
							open={activeItem.label === TabsLabels.Links}
							unmountOnExit
							className={styles.componentItem}
						>
							<TemplateLinks
								onNextStep={onNextValue}
								onPreviousStep={onPreviousValue}
								onRemoveLink={handleRemoveTemplateLink}
							/>
						</CustomFade>
					</CustomGrid>
				</form>
			</FormProvider>
		</CustomGrid>
	);
};

export const CreateAdminRoomContainer = memo(Component);
