import { memo, useCallback, useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useStore } from 'effector-react';
import clsx from 'clsx';

import { useNavigation } from '@hooks/useNavigation';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomAutocomplete } from 'shared-frontend/library/custom/CustomAutocomplete';
import { IBusinessCategory } from 'shared-types';
import { AutocompleteType } from 'shared-frontend/types';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomLinkIcon } from 'shared-frontend/icons/OtherIcons/CustomLinkIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChalkboardUser, faFolderClosed, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

// components
import { EditPrivacyProps } from '@components/TemplateManagement/EditPrivacy/types';
import { OptionItem } from '@components/TemplateManagement/EditPrivacy/OptionItem/OptionItem';

// icons
import { ArrowLeftIcon } from 'shared-frontend/icons/OtherIcons/ArrowLeftIcon';
import { LockIcon } from 'shared-frontend/icons/OtherIcons/LockIcon';
import { PeopleIcon } from 'shared-frontend/icons/OtherIcons/PeopleIcon';

// const
import { Translation } from '@library/common/Translation/Translation';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { ErrorMessage } from 'shared-frontend/library/common/ErrorMessage';


// store
import { useRouter } from 'next/router';
import { $businessCategoriesStore, $isTrial } from '../../../store';
import frontendConfig from '../../../const/config';

// styles
import styles from './EditPrivacy.module.scss';

const options = [
    {
        id: '1',
        value: 'private',
        translationKey: 'editPrivacy.private',
        Icon: LockIcon,
        availableWithTrial: true,
        withUpgradeButton: false,
    },
    {
        id: '2',
        value: 'public',
        translationKey: 'editPrivacy.public',
        Icon: PeopleIcon,
        availableWithTrial: false,
        withUpgradeButton: true,
    },
];

const Component = ({
    onSubmit,
    handleEnterMeeting,
    handleScheduleMeeting,
    onPreviousStep,
    onUpgradePlan,
}: EditPrivacyProps) => {
    const isTrial = useStore($isTrial);
    const router = useRouter();
    const isCustom = !!router.query.tags;
    const businessCategories = useStore($businessCategoriesStore);

    const { control, register, setValue, watch, formState: { errors } } = useFormContext();

    const { activeTab, onChange } = useNavigation({ tabs: options });
    const tagsErrorMessage: string = errors?.tags?.[0]?.message || '';
    const customLink = useWatch({ control, name: 'customLink' });
    const customLinkInputProps = useMemo(
        () => ({
            startAdornment: <CustomLinkIcon width="24px" height="24px" />,
        }),
        [],
    );
    const customLinkErrorMessage: string =
        errors?.customLink?.[0]?.message || '';
    const customLinkProps = useMemo(() => register('customLink'), []);

    useEffect(() => {
        const isPublic = watch('isPublic');
        if (isPublic) {
            onChange(options[1].value);
        }
    }, []);

    useEffect(() => {
        if (isCustom) {
            onChange(options[1].value);
            setValue('isPublic', true);
        }
    }, []);

    const handleChangeActiveOption = useCallback(
        (value: string) => {
            onChange(value);
            setValue('isPublic', value === options[1].value);
        },
        [onChange],
    );

    const optionItems = useMemo(
        () =>
            options.map(
                ({
                    id,
                    value,
                    translationKey,
                    Icon,
                    availableWithTrial,
                    withUpgradeButton,
                }) =>
                    isCustom && id === '1' ? null : (
                        <OptionItem
                            key={id}
                            onClick={() => handleChangeActiveOption(value)}
                            isActive={activeTab.value === value}
                            nameSpace="createRoom"
                            translationKey={translationKey}
                            Icon={Icon}
                            disabled={!availableWithTrial && isTrial}
                            onUpgradeClick={
                                withUpgradeButton &&
                                    !availableWithTrial &&
                                    isTrial
                                    ? onUpgradePlan
                                    : undefined
                            }
                        />
                    ),
            ),
        [options, activeTab, handleChangeActiveOption, isTrial, onUpgradePlan],
    );

    const businessCategoriesOptions = useMemo(
        () =>
            businessCategories.list.map(item => ({
                ...item,
                label: item.value,
            })),
        [businessCategories.list],
    );

    // const textWithLinks = useMemo(
    //     () =>
    //         !isTrial
    //             ? translation(`editPrivacy.link`, {
    //                   termsLink: `${frontendConfig.frontendUrl}/agreements`,
    //                   privacyLink: `https://en.wikipedia.org/wiki/Not_safe_for_work`,
    //               })
    //             : translation('editPrivacy.upgradePlan'),
    //     [isTrial],
    // );

    return (
        // <CustomGrid container className={styles.wrapper} justifyContent="flex-start">
        //     <CustomTypography
        //         variant="body2"
        //         fontSize={48}
        //         color="colors.white.primary"
        //         nameSpace="createRoom"
        //         translation="editPrivacy.title"
        //         className={styles.editPrivacyTitle}
        //     />
        //     <CustomPaper variant="black-glass" className={styles.paper}>
        //         <CustomGrid container direction="column" gap={3}>
        //             <CustomTypography
        //                 variant="h4bold"
        //                 color="colors.white.primary"
        //                 nameSpace="createRoom"
        //                 translation="editPrivacy.title"
        //             />
        //             {optionItems}
        //         </CustomGrid>
        //     </CustomPaper>

        //     <CustomGrid
        //         container
        //         gap={1.5}
        //         flexWrap="nowrap"
        //         justifyContent="center"
        //         className={styles.buttonsGroup}
        //     >
        //         <ActionButton
        //             variant="gray"
        //             Icon={<ArrowLeftIcon width="32px" height="32px" />}
        //             className={styles.actionButton}
        //             onAction={onPreviousStep}
        //         />
        //         <CustomButton
        //             label={
        //                 <Translation
        //                     nameSpace="createRoom"
        //                     translation="actions.submit"
        //                 />
        //             }
        //             onClick={onSubmit}
        //             className={styles.button}
        //         />
        //     </CustomGrid>
        // </CustomGrid>
        <CustomGrid
            container
            alignItems="center"
            justifyContent="flex-start"
            direction="column"
            className={styles.wrapper}
        >
            
            <CustomPaper variant="black-glass" className={styles.paper}>
                <CustomGrid container direction="column">
                    <CustomGrid
                        container
                        gap={2}
                        flexWrap="nowrap"
                        justifyContent="space-between"
                        className={styles.label}
                    >
                        <CustomTypography
                            variant="body3"
                            color="colors.white.primary"
                            nameSpace="createRoom"
                            translation="editDescription.form.link"
                            className={styles.linkLabel}
                        />
                        {/* <CustomTypography
                            variant="body3"
                            className={styles.customLinkPreview}
                        >
                            {`${frontendConfig.frontendUrl}/.../${customLink}`}
                        </CustomTypography> */}
                    </CustomGrid>
                    <CustomInput
                        autoComplete="off"
                        color="secondary"
                        InputProps={customLinkInputProps}
                        error={customLinkErrorMessage}
                        {...customLinkProps}
                    />
                    <CustomTypography
                        variant="body3"
                        color="colors.white.primary"
                        nameSpace="createRoom"
                        translation="editDescription.form.tags"
                        className={styles.label}
                    />
                    <CustomAutocomplete<AutocompleteType<IBusinessCategory>>
                        multiple
                        freeSolo
                        includeInputInList
                        disableClearable
                        autoHighlight
                        options={businessCategoriesOptions}
                        control={control}
                        classes={{
                            inputRoot: isCustom
                                ? styles.disabledTags
                                : undefined,
                        }}
                        name="tags"
                        autoComplete
                        disabled={isCustom}
                        error={tagsErrorMessage}
                        errorComponent={
                            <ConditionalRender
                                condition={Boolean(tagsErrorMessage)}
                            >
                                <ErrorMessage error={Boolean(tagsErrorMessage)}>
                                    <Translation
                                        nameSpace="errors"
                                        translation={tagsErrorMessage}
                                    />
                                </ErrorMessage>
                            </ConditionalRender>
                        }
                    />
                </CustomGrid>
            </CustomPaper>
            <CustomPaper variant="black-glass" className={styles.eventPaper}>
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="space-around"
                >
                    <CustomGrid item xs container alignItems="center" justifyContent="center" direction="column">
                        <CustomTypography className={styles.eventIconWrapper}>
                            <FontAwesomeIcon icon={faFolderClosed} className={styles.eventIcon} />
                        </CustomTypography>
                        <CustomTooltip
                            nameSpace="createRoom"
                            translation="editPrivacy.eventBtns.tooltips.saveRuume"
                            placement="bottom"
                        >
                            <CustomButton
                                label={
                                    <Translation
                                        nameSpace="createRoom"
                                        translation="editPrivacy.eventBtns.buttons.saveRuume"
                                    />
                                }
                                onClick={onSubmit}
                                className={styles.eventBtn}
                            />
                        </CustomTooltip>

                    </CustomGrid>
                    <CustomGrid item xs container alignItems="center" justifyContent="center" direction="column">
                        <CustomTypography className={styles.eventIconWrapper}>
                            <FontAwesomeIcon icon={faChalkboardUser} className={styles.eventIcon} />
                        </CustomTypography>
                        <CustomTooltip
                            nameSpace="createRoom"
                            translation="editPrivacy.eventBtns.tooltips.enter"
                            placement="bottom"
                        >
                            <CustomButton
                                label={
                                    <Translation
                                        nameSpace="createRoom"
                                        translation="editPrivacy.eventBtns.buttons.enter"
                                    />
                                }
                                onClick={handleEnterMeeting}
                                className={styles.eventBtn}
                            />
                        </CustomTooltip>

                    </CustomGrid>
                    <CustomGrid item xs container alignItems="center" justifyContent="center" direction="column">
                        <CustomTypography className={styles.eventIconWrapper}>
                            <FontAwesomeIcon icon={faCalendarDays} className={styles.eventIcon} />
                        </CustomTypography>
                        <CustomTooltip
                            nameSpace="createRoom"
                            translation="editPrivacy.eventBtns.tooltips.schedule"
                            placement="bottom"
                        >
                            <CustomButton
                                label={
                                    <Translation
                                        nameSpace="createRoom"
                                        translation="editPrivacy.eventBtns.buttons.schedule"
                                    />
                                }
                                onClick={handleScheduleMeeting}
                                className={styles.eventBtn}
                            />
                        </CustomTooltip>

                    </CustomGrid>
                </CustomGrid>
            </CustomPaper>
            <CustomGrid
                container
                gap={1.5}
                flexWrap="nowrap"
                justifyContent="center"
                className={styles.buttonsGroup}
            >
                <ActionButton
                    variant="gray"
                    Icon={<ArrowLeftIcon width="32px" height="32px" />}
                    className={styles.actionButton}
                    onAction={onPreviousStep}
                />
            </CustomGrid>
        </CustomGrid >
    );
};

export const EditPrivacy = memo(Component);
