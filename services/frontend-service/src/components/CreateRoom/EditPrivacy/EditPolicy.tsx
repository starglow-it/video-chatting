import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

// hooks
import { useLocalization } from '@hooks/useTranslation';
import { useNavigation } from '@hooks/useNavigation';

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
import { RoundInfoIcon } from '@library/icons/RoundIcons/RoundInfoIcon';

// const
import frontendConfig from '../../../const/config';

// styles
import styles from './EditPrivacy.module.scss';

const options = [
    { value: 'private', translationKey: 'editPrivacy.private', Icon: LockIcon },
    { value: 'public', translationKey: 'editPrivacy.public', Icon: PeopleIcon },
];

const Component = ({ onNextStep, onPreviousStep }: EditPrivacyProps) => {
    const { setValue, watch } = useFormContext();

    const { translation } = useLocalization('createRoom');

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

    const textWithLinks = useMemo(
        () =>
            translation(`editPrivacy.link`, {
                termsLink: `${frontendConfig.frontendUrl}/terms`,
                privacyLink: `${frontendConfig.frontendUrl}/privacy`,
            }),
        [],
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
                <CustomGrid container alignItems="center" className={styles.policiesLink}>
                    <RoundInfoIcon width="24px" height="24px" />
                    <CustomTypography
                        variant="body2"
                        dangerouslySetInnerHTML={{
                            __html: textWithLinks,
                        }}
                    />
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
