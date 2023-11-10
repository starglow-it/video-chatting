import { memo, useCallback, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useStore } from 'effector-react';

import { useNavigation } from '@hooks/useNavigation';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

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

// store
import { $isTrial } from '../../../store';

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
    onPreviousStep,
    onUpgradePlan,
    template,
}: EditPrivacyProps) => {
    const isTrial = useStore($isTrial);
    const isCustom = template?.categoryType === 'interior-design';

    const { setValue, watch } = useFormContext();

    const { activeTab, onChange } = useNavigation({ tabs: options });

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
        <CustomGrid container className={styles.wrapper}>
            <CustomPaper variant="black-glass" className={styles.paper}>
                <CustomGrid container direction="column" gap={3}>
                    <CustomTypography
                        variant="h4bold"
                        color="colors.white.primary"
                        nameSpace="createRoom"
                        translation="editPrivacy.title"
                    />
                    {optionItems}
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
                <CustomButton
                    label={
                        <Translation
                            nameSpace="createRoom"
                            translation="actions.submit"
                        />
                    }
                    onClick={onSubmit}
                    className={styles.button}
                />
            </CustomGrid>
        </CustomGrid>
    );
};

export const EditPrivacy = memo(Component);
