import React, { memo, useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import clsx from 'clsx';

import { InputAdornment } from '@mui/material';

// custom
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';

// components
import { ActionButton } from '@library/common/ActionButton/ActionButton';

// icons
import { SocialIcon } from '@library/icons/SocialIcon';
import { TrashIcon } from '@library/icons/TrashIcon';

// styles
import styles from './EditSocialInfo.module.scss';

// const
import { SOCIAL_LINKS, SOCIALS_ICONS } from '../../../const/profile/socials';

const EditSocialInfo = memo(() => {
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
                            className={clsx(styles.socialBtn, {
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
        <CustomPaper className={styles.paperWrapper}>
            <CustomBox
                display="grid"
                gridTemplateColumns="minmax(110px, 192px) 1fr"
                gridTemplateRows="repeat(1, 1fr)"
            >
                <CustomBox gridArea="1/1/1/1">
                    <CustomGrid container alignItems="center">
                        <SocialIcon width="24px" height="24px" className={styles.icon} />
                        <CustomTypography
                            variant="body1"
                            fontWeight="600"
                            nameSpace="profile"
                            translation="social"
                        />
                    </CustomGrid>
                </CustomBox>
                <CustomGrid
                    gridArea="1/2/1/2"
                    container
                    wrap="nowrap"
                    className={styles.contentWrapper}
                >
                    <CustomGrid container direction="column" justifyContent="center" gap={4}>
                        <CustomTypography
                            variant="body1"
                            nameSpace="profile"
                            translation="editProfile.social.title"
                        />
                        <CustomGrid container gap={1.25}>
                            {renderSocials}
                        </CustomGrid>
                        <CustomGrid container direction="column" gap={2.5}>
                            {profileLinks}
                        </CustomGrid>
                    </CustomGrid>
                </CustomGrid>
            </CustomBox>
        </CustomPaper>
    );
});

export { EditSocialInfo };
