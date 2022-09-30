import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { EditPrivacyProps } from '@components/CreateRoom/EditPrivacy/types';
import { OptionItem } from '@components/CreateRoom/EditPrivacy/OptionItem/OptionItem';

// icons
import { ArrowLeftIcon } from '@library/icons/ArrowLeftIcon';
import { LockIcon } from '@library/icons/LockIcon';
import { PeopleIcon } from '@library/icons/PeopleIcon';

// hooks
import { useNavigation } from '@hooks/useNavigation';

// styles
import styles from './EditPrivacy.module.scss';

const options = [
    { value: 'private', translationKey: 'editPrivacy.private', Icon: LockIcon },
    { value: 'public', translationKey: 'editPrivacy.public', Icon: PeopleIcon },
];

const Component = ({ onNextStep, onPreviousStep }: EditPrivacyProps) => {
    const { setValue, watch } = useFormContext();

    const { activeTab, onChange } = useNavigation({ tabs: options });

    useEffect(() => {
        const isPublic = watch('isPublic');
        if (isPublic) {
            onChange(options[1].value);
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
            options.map(({ value, translationKey, Icon }) => (
                <OptionItem
                    onClick={() => handleChangeActiveOption(value)}
                    isActive={activeTab.value === value}
                    nameSpace="createRoom"
                    translationKey={translationKey}
                    Icon={Icon}
                />
            )),
        [options, activeTab, handleChangeActiveOption],
    );

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
                    Icon={<ArrowLeftIcon width="24px" height="24px" />}
                    className={styles.actionButton}
                    onAction={onPreviousStep}
                />
                <ActionButton
                    variant="accept"
                    Icon={<ArrowLeftIcon width="24px" height="24px" className={styles.icon} />}
                    className={styles.actionButton}
                    onAction={onNextStep}
                />
            </CustomGrid>
        </CustomGrid>
    );
};

export const EditPolicy = memo(Component);
