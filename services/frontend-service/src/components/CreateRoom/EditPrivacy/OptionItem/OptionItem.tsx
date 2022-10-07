import React, { memo, useMemo } from 'react';
import clsx from 'clsx';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// types
import { OptionItemProps } from '@components/CreateRoom/EditPrivacy/OptionItem/types';

// icons
import { SuccessIcon } from '@library/icons/SuccessIcon';

// styles
import styles from './OptionItem.module.scss';

const statementsKeys = ['availability', 'editable', 'changePrivacyPossibility'];

const Component = ({ isActive, nameSpace, translationKey, Icon, onClick }: OptionItemProps) => {
    const statements = useMemo(
        () =>
            statementsKeys.map(key => (
                <CustomGrid item container gap={1} alignItems="center">
                    <SuccessIcon width="16px" height="16px" className={styles.successIcon} />
                    <CustomTypography
                        variant="body2"
                        color="colors.white.primary"
                        nameSpace={nameSpace}
                        translation={`${translationKey}.${key}`}
                    />
                </CustomGrid>
            )),
        [translationKey],
    );

    return (
        <CustomGrid
            container
            direction="column"
            gap={2}
            onClick={onClick}
            className={clsx(styles.container, { [styles.active]: isActive })}
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
                    color="colors.white.primary"
                    nameSpace={nameSpace}
                    translation={`${translationKey}.title`}
                />
            </CustomGrid>
            <CustomGrid container direction="column" gap={1}>
                {statements}
            </CustomGrid>
        </CustomGrid>
    );
};

export const OptionItem = memo(Component);
