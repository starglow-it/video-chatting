import React, { useRef, memo, useEffect, useMemo } from 'react';
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
    const prevFieldsCount = useRef(0);

    const {
        register,
        control,
        setFocus,
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
                        append({ key: social.key, value: 'https://' });
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

    useEffect(() => {
        if (prevFieldsCount.current < fields.length) {
            prevFieldsCount.current = fields.length;
            setFocus(`socials[${fields.length - 1}].value`);
        }
    }, [fields]);

    const profileLinks = useMemo(
        () =>
            fields?.map((social, index) => {
                const Icon = SOCIALS_ICONS[social.key];
                const inputKey = `socials[${index}].value`
                const fieldError = errors[inputKey]?.[0]?.message;

                const {onChange, ...registerData} = register(inputKey);

                const handleClearLink = () => {
                    remove(index);
                };

                const handleChange = async (event) => {
                    const {value} = event.target;

                    if (value) {
                        await onChange(event);
                    } else {
                        event.target.value = 'https://';

                        await onChange(event);
                    }
                }

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
                        onChange={handleChange}
                        {...registerData}
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
};

export const Socials = memo(Component);
