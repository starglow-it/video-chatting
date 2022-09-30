import React, { memo } from 'react';
import clsx from 'clsx';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// types
import { OptionItemProps } from '@components/CreateRoom/EditPrivacy/OptionItem/types';

// styles
import styles from './OptionItem.module.scss';

const Component = ({ isActive, nameSpace, translationKey, Icon, onClick }: OptionItemProps) => (
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
            <CustomTypography
                variant="body2"
                color="colors.white.primary"
                nameSpace={nameSpace}
                translation={`${translationKey}.availability`}
            />
            <CustomTypography
                variant="body2"
                color="colors.white.primary"
                nameSpace={nameSpace}
                translation={`${translationKey}.editable`}
            />
            <CustomTypography
                variant="body2"
                color="colors.white.primary"
                nameSpace={nameSpace}
                translation={`${translationKey}.changePrivacyPossibility`}
            />
        </CustomGrid>
    </CustomGrid>
);

export const OptionItem = memo(Component);
