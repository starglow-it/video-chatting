import React, { memo, useMemo } from 'react';
import clsx from 'clsx';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// types
import { OptionItemProps } from '@components/TemplateManagement/EditPrivacy/OptionItem/types';

// icons
import { SuccessIcon } from '@library/icons/SuccessIcon';

// styles
import styles from './OptionItem.module.scss';

const statementsKeys = [
    { id: '1', key: 'availability' },
    { id: '2', key: 'editable' },
    { id: '3', key: 'changePrivacyPossibility' },
];

const Component = ({ isActive, nameSpace, translationKey, Icon, onClick, disabled = false, onUpgradeClick }: OptionItemProps) => {
    const statements = useMemo(
        () =>
            statementsKeys.map(({ id, key }) => (
                <CustomGrid key={id} item container gap={1} alignItems="center">
                    <SuccessIcon
                        width="16px"
                        height="16px"
                        className={clsx(styles.successIcon, {[styles.disabled]: disabled })}
                    />
                    <CustomTypography
                        variant="body2"
                        nameSpace={nameSpace}
                        translation={`${translationKey}.${key}`}
                        className={styles.statement}
                    />
                </CustomGrid>
            )),
        [translationKey, disabled],
    );

    return (
        <CustomGrid
            container
            direction="column"
            gap={2}
            onClick={!disabled ? onClick : undefined}
            className={clsx(styles.container, { [styles.active]: isActive, [styles.disabled]: disabled })}
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
                    nameSpace={nameSpace}
                    translation="editPrivacy.actions.upgrade"
                    onClick={onUpgradeClick}
                    className={styles.upgradeButton}
                />
            </ConditionalRender>
        </CustomGrid>
    );
};

export const OptionItem = memo(Component);
