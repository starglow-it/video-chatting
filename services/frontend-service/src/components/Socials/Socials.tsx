/* eslint-disable react/require-default-props */
import { useRef, memo, useEffect, useMemo, ReactNode } from 'react';
import clsx from 'clsx';
import InputAdornment from '@mui/material/InputAdornment';
import { useFieldArray, useFormContext } from 'react-hook-form';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';

// components
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { TrashIcon } from 'shared-frontend/icons/OtherIcons/TrashIcon';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

// styles
import styles from './Socials.module.scss';

// const
import { SOCIAL_LINKS, SOCIALS_ICONS } from '../../const/profile/socials';

const SocialInput = ({
    social,
    index,
    onRemove,
}: {
    social: any;
    index: number;
    onRemove: (index: number) => void;
}) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const Icon = SOCIALS_ICONS[social.key];
    const inputKey = `socials[${index}].value`;
    const fieldError = errors[inputKey]?.message;

    const { onChange, ...registerData } = register(inputKey);

    const handleClearLink = () => {
        onRemove(index);
    };

    const handleChange = async (event: { target: any; type?: any }) => {
        const { value } = event.target;

        if (value) {
            event.target.value = value;

            await onChange(event);
        } else {
            event.target.value = 'https://';

            await onChange(event);
        }
    };

    const handlePasteLink = async (event: { target: any; type?: any }) => {
        const { value } = event.target;

        if (value) {
            event.target.value = /https?/.test(value)
                ? value
                : `https://${value}`;

            await onChange(event);
        } else {
            event.target.value = 'https://';

            await onChange(event);
        }
    };

    return (
        <CustomInput
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
            onPaste={handlePasteLink}
            onChange={handleChange}
            {...registerData}
        />
    );
};

type Props = {
    buttonClassName: string;
    title?: ReactNode | null;
};

const Component = ({ buttonClassName, title = null }: Props) => {
    const prevFieldsCount = useRef(0);

    const {
        control,
        setFocus,
        formState: { errors },
    } = useFormContext();

    const { fields, remove, append } = useFieldArray({
        control,
        name: 'socials',
    });

    const handleRemove = (index: number | number[] | undefined) => {
        remove(index);
    };

    const renderSocials = useMemo(
        () =>
            SOCIAL_LINKS.map(social => {
                const isThereField = fields.find(
                    field => social.key === field.key,
                );
                const fieldIndex = fields.findIndex(
                    field => social.key === field.key,
                );

                const Icon = SOCIALS_ICONS[social.key];

                const handleAction = () => {
                    if (isThereField) {
                        if (fieldIndex !== -1) {
                            handleRemove(fieldIndex);
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
        prevFieldsCount.current = fields.length;
    }, []);

    useEffect(() => {
        if (prevFieldsCount.current < fields.length) {
            prevFieldsCount.current = fields.length;
            setFocus(`socials[${fields.length - 1}].value`);
        }
    }, [fields]);

    const profileLinks = useMemo(
        () =>
            fields?.map((social, index) => (
                <CustomBox key={social.id}>
                    <SocialInput
                        onRemove={handleRemove}
                        social={social}
                        index={index}
                    />
                </CustomBox>
            )),
        [fields, errors],
    );

    return (
        <CustomGrid
            container
            direction="column"
            justifyContent="center"
            gap={4}
        >
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

export const Socials = memo(Component);
