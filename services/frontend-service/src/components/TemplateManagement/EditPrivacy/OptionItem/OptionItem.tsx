import React, { memo, useMemo } from 'react';
import clsx from 'clsx';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// types
import { OptionItemProps } from '@components/TemplateManagement/EditPrivacy/OptionItem/types';

// styles
import { Translation } from '@library/common/Translation/Translation';
import styles from './OptionItem.module.scss';

const Component = ({
    isActive,
    nameSpace,
    translationKey,
    Icon,
    onClick,
    disabled = false,
    onUpgradeClick,
}: OptionItemProps) => {
    const statements = useMemo(
        () => (
            <CustomGrid item container gap={1} alignItems="center">
                <CustomTypography
                    variant="body2"
                    nameSpace={nameSpace}
                    translation={`${translationKey}.availability`}
                    className={styles.statement}
                />
            </CustomGrid>
        ),

        [translationKey, disabled],
    );

    return (
        <CustomGrid
            container
            direction="column"
            gap={2}
            onClick={!disabled ? onClick : undefined}
            className={clsx(styles.container, {
                [styles.active]: isActive,
                [styles.disabled]: disabled,
            })}
        >
            <CustomGrid container gap={1}>
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                    className={styles.iconWrapper}
                >
                    <Icon width="16px" height="16px" className={styles.icon} />
                </CustomGrid>
                <CustomTypography
                    variant="body1bold"
                    nameSpace={nameSpace}
                    translation={`${translationKey}.title`}
                    className={styles.title}
                />
            </CustomGrid>
            <CustomGrid container direction="column" gap={1}>
                {statements}
            </CustomGrid>
            <ConditionalRender condition={Boolean(onUpgradeClick)}>
                <CustomButton
                    label={
                        <Translation
                            nameSpace={nameSpace}
                            translation="editPrivacy.actions.upgrade"
                        />
                    }
                    onClick={onUpgradeClick}
                    className={styles.upgradeButton}
                />
            </ConditionalRender>
        </CustomGrid>
    );
};

export const OptionItem = memo(Component);
