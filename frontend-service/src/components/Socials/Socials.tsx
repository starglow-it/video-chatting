import React, { memo, useMemo } from 'react';
import clsx from 'clsx';

import { useFieldArray, useFormContext } from 'react-hook-form';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';

// components
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { InputAdornment } from '@mui/material';
import { TrashIcon } from '@library/icons/TrashIcon';

// styles
import styles from './Socials.module.scss';

// const
import { SOCIAL_LINKS, SOCIALS_ICONS } from '../../const/profile/socials';

const Component: React.FunctionComponent<{ buttonClassName?: string; title?: React.ElementType }> = ({
    buttonClassName,
    title,
}) => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext();

    const { fields, remove, append } = useFieldArray({ control, name: 'socials' });

    const renderSocials = useMemo(
        () =>
            SOCIAL_LINKS.map(social => {
                const isThereField = fields.find(field => social.key === field.key);
                const fieldIndex = fields.findIndex(field => social.key === field.key);

                const Icon = SOCIALS_ICONS[social.key];

                const handleAction = () => {
                    if (isThereField) {
                        if (fieldIndex !== -1) {
                            remove(fieldIndex);
                        }
                    } else {
                        append({ key: social.key, value: '' }, { shouldFocus: true });
                    }
                };

                return (
                    <CustomTooltip
                        key={social.key}
                        nameSpace="common"
                        translation={`tooltips.${social.key}`}
                    >
                        <ActionButton
                            onAction={handleAction}
                            className={clsx(styles.socialBtn, buttonClassName, {
                                [styles.active]: Boolean(isThereField),
                            })}
                            Icon={<Icon width="36px" height="36px" />}
                        />
                    </CustomTooltip>
                );
            }),
        [fields],
    );

    const profileLinks = useMemo(
        () =>
            fields?.map((social, index) => {
                const Icon = SOCIALS_ICONS[social.key];

                const fieldError = errors[`socials[${index}].value`]?.[0]?.message;

                const handleClearLink = () => {
                    remove(index);
                };

                return (
                    <CustomInput
                        key={social.id}
                        error={fieldError}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Icon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <TrashIcon
                                        width="24px"
                                        height="24px"
                                        className={styles.trashIcon}
                                        onClick={handleClearLink}
                                    />
                                </InputAdornment>
                            ),
                        }}
                        {...register(`socials.${index}.value`)}
                    />
                );
            }),
        [fields, errors],
    );

    return (
        <CustomGrid container direction="column" justifyContent="center" gap={4}>
            {title}
            <CustomGrid container gap={1.25}>
                {renderSocials}
            </CustomGrid>
            <CustomGrid container direction="column" gap={2.5}>
                {profileLinks}
            </CustomGrid>
        </CustomGrid>
    );
};

Component.defaultProps = {
    buttonClassName: '',
    title: 'Social'
};

export const Socials = memo(Component);
